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


const { INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, PAYMENT_REQUIRED } = HttpStatusCode;
const { INTERNAL_ERROR, BOOKING_ID_NOT_FOUND, DATA_MISMATCH, WALLET_ID_NOT_FOUND, INSUFFICIENT_BALANCE } = Messages;

export class WalletPaymentUseCase implements IWalletPaymentUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _walletRepository: IWalletRepository,
        private readonly _notificationService: INotificationService,
        private readonly _bookingSchedulerService: IBookingSchedulerService,
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

                throw { status: INTERNAL_SERVER_ERROR, message: error.message || INTERNAL_ERROR };
            };

            booking.paymentInfo = {
                mop: PaymentMode.WALLET,
                status: PaymentStatus.SUCCESS,
                paidAt: new Date(),
                transactionId,
            };

            booking.status = BookingStatus.CONFIRMED;
            booking.esCrowAmout = totalAmount;
            booking.acknowledgment = {
                isWorkCompletedByProvider: false,
                isWorkConfirmedByUser: false,
            };

            let updatedBooking: Booking | null;
            try {
                updatedBooking = await this._bookingRepository.updateBooking(bookingId, booking);
                if (!updatedBooking) throw { status: NOT_FOUND, message: "hlo hlo" };

                const jobKey = `paymentBooking-${bookingId}`;
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

            this._notificationService.notifyBookingConfirmation(booking.providerUserId, {
                bookingId: booking.bookingId,
                scheduledAt: booking.scheduledAt,
                status: booking.status,
                acknowledgment: {
                    isWorkCompletedByProvider: booking.acknowledgment.isWorkCompletedByProvider,
                    isWorkConfirmedByUser: booking.acknowledgment.isWorkConfirmedByUser
                }
            });

            return {
                bookingId: booking.bookingId,
                status: booking.status
            };

        } catch (error: any) {
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}