import { v4 as uuidv4 } from "uuid";
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { IWalletRepository } from "../../../domain/interface/RepositoryInterface/IWalletRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { TransactionStatus, TransactionType } from "../../../shared/Enums/Transaction";
import { Messages } from "../../../shared/Messages";
import { WalletPaymentInputDTO, WalletPaymentOutputDTO } from "../../DTO's/WalletDTO/walletPaymentDTO";
import { IWalletPaymentUseCase } from "../../Interface/useCases/Client/IWalletPaymentUseCase";
import { PaymentMode, PaymentStatus } from "../../../shared/Enums/Payment";
import { BookingStatus } from "../../../shared/Enums/BookingStatus";
import { INotificationService } from "../../../domain/interface/ServiceInterface/INotificationService";
import { Booking } from "../../../domain/entities/BookingEntity";
import { IBookingSchedulerService } from "../../../domain/interface/ServiceInterface/IBookingSchedulerService";
import { SendBookingConfirmedNotificationUseCase } from "../Notificiations/SendBookingConfirmedNotificationUseCase";


const { INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, PAYMENT_REQUIRED } = HttpStatusCode;
const { INTERNAL_ERROR, BOOKING_ID_NOT_FOUND, DATA_MISMATCH, WALLET_ID_NOT_FOUND, INSUFFICIENT_BALANCE } = Messages;

export class WalletPaymentUseCase implements IWalletPaymentUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _walletRepository: IWalletRepository,
        private readonly _notificationService: INotificationService,
        private readonly _bookingSchedulerService: IBookingSchedulerService,
        private readonly _sendBookingConfirmedNotificationUseCase: SendBookingConfirmedNotificationUseCase

    ) { }

    async execute(input: WalletPaymentInputDTO): Promise<WalletPaymentOutputDTO> {
        try {

            const { userId, bookingId } = input;
            let booking = await this._bookingRepository.findByBookingId(bookingId);

            if (!booking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };
            if (booking.userId !== userId) throw { status: BAD_REQUEST, message: DATA_MISMATCH };

            const wallet = await this._walletRepository.findByUserId(userId);
            if (!wallet) throw { status: NOT_FOUND, message: WALLET_ID_NOT_FOUND };
            const totalAmount = booking.pricing.baseCost + booking.pricing.distanceFee;
            if (wallet.balance < totalAmount) throw { status: PAYMENT_REQUIRED, message: INSUFFICIENT_BALANCE };

            const transactionId = `Wlt_${uuidv4()}`;

            try {
                await this._walletRepository.updateWalletOnTransaction({
                    userId: userId,
                    transactionId,
                    amount: totalAmount,
                    status: TransactionStatus.SUCCESS,
                    type: TransactionType.DEBIT,
                });
            } catch (error: any) {
                await this._walletRepository.updateWalletOnTransaction({
                    userId: userId,
                    transactionId,
                    amount: totalAmount,
                    status: TransactionStatus.FAILED,
                    type: TransactionType.DEBIT,
                    reason: error.message || "Wallet Payment failed"
                });

                const updateData = {
                    paymentInfo: {
                        mop: PaymentMode.WALLET,
                        status: PaymentStatus.FAILED,
                        paidAt: new Date(),
                        transactionId,
                    },
                    status: BookingStatus.CANCELLED,
                };
                await this._bookingRepository.updateBooking(bookingId, updateData);

                throw { status: INTERNAL_SERVER_ERROR, message: error.message || INTERNAL_ERROR };
            };

            const updateData = {
                paymentInfo: {
                    mop: PaymentMode.WALLET,
                    status: PaymentStatus.SUCCESS,
                    paidAt: new Date(),
                    transactionId,
                },
                status: BookingStatus.CONFIRMED,
                esCrowAmout: totalAmount,
                acknowledgment: {
                    isWorkCompletedByProvider: false,
                    isWorkConfirmedByUser: false,
                },
            };

            let updatedBooking: Booking | null;
            try {

                updatedBooking = await this._bookingRepository.updateBooking(bookingId, updateData);
                if (!updatedBooking || !updatedBooking.paymentInfo) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

                const jobKey = `paymentBooking-${updatedBooking.bookingId}`;
                this._bookingSchedulerService.cancel(jobKey);

            } catch (error: any) {

                await this._walletRepository.updateWalletOnTransaction({
                    userId,
                    transactionId: `Rfd-${transactionId}`,
                    amount: totalAmount,
                    status: TransactionStatus.SUCCESS,
                    type: TransactionType.CREDIT,
                    reason: "Refund due to booking update failure",
                });

                throw { status: INTERNAL_SERVER_ERROR, message: error.message || INTERNAL_ERROR };
            }

            // this._notificationService.//notifyBookingConfirmation(updatedBooking.providerUserId, {
            //     bookingId: updatedBooking.bookingId,
            //     scheduledAt: updatedBooking.scheduledAt,
            //     status: updatedBooking.status,
            //     acknowledgment: {
            //         isWorkCompletedByProvider: updatedBooking.acknowledgment?.isWorkCompletedByProvider || false,
            //         isWorkConfirmedByUser: updatedBooking.acknowledgment?.isWorkConfirmedByUser || false
            //     }
            // });

            //to user
            await this._sendBookingConfirmedNotificationUseCase.execute({
                userId: updatedBooking.userId,
                title: "Booking Confirmed",
                message: `Your booking has been confirmed for ${updatedBooking.scheduledAt.toLocaleString()}.`,
                metadata: {
                    bookingId: updatedBooking.bookingId,
                    scheduledAt: updatedBooking.scheduledAt,
                    status: updatedBooking.status,
                    acknowledgment: {
                        isWorkCompletedByProvider: updatedBooking.acknowledgment?.isWorkCompletedByProvider || false,
                        isWorkConfirmedByUser: updatedBooking.acknowledgment?.isWorkConfirmedByUser || false
                    }
                }
            });

            //to provider
            await this._sendBookingConfirmedNotificationUseCase.execute({
                userId: updatedBooking.providerUserId,
                title: "New Booking",
                message: "You have a new booking",
                metadata: {
                    bookingId: updatedBooking.bookingId,
                    scheduledAt: updatedBooking.scheduledAt,
                    status: updatedBooking.status,
                    acknowledgment: {
                        isWorkCompletedByProvider: updatedBooking.acknowledgment?.isWorkCompletedByProvider || false,
                        isWorkConfirmedByUser: updatedBooking.acknowledgment?.isWorkConfirmedByUser || false
                    }
                }
            });

            return {
                bookingId: updatedBooking.bookingId,
                status: updatedBooking.status,
                paymentInfo: {
                    mop: updatedBooking.paymentInfo.mop,
                    status: updatedBooking.paymentInfo.status,
                    paidAt: updatedBooking.paymentInfo.paidAt,
                    transactionId: updatedBooking.paymentInfo.transactionId,
                }
            };

        } catch (error: any) {
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}