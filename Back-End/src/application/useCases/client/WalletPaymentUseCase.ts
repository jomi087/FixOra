import { v4 as uuidv4 } from "uuid";
import { IBookingRepository } from "../../../domain/interface/repositoryInterface/IBookingRepository";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IWalletRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { TransactionStatus, TransactionType } from "../../../shared/enums/Transaction";
import { Messages } from "../../../shared/const/Messages";
import { WalletPaymentInputDTO, WalletPaymentOutputDTO } from "../../dtos/WalletDTO/walletPaymentDTO";
import { IWalletPaymentUseCase } from "../../Interface/useCases/clientTemp/IWalletPaymentUseCase";
import { PaymentMode, PaymentStatus } from "../../../shared/enums/Payment";
import { BookingStatus } from "../../../shared/enums/BookingStatus";
import { INotificationService } from "../../../domain/interface/serviceInterface/INotificationService";
import { Booking } from "../../../domain/entities/BookingEntity";
import { IBookingSchedulerService } from "../../../domain/interface/serviceInterface/IBookingSchedulerService";
import { SendBookingConfirmedInput } from "../../dtos/NotificationDTO";
import { INotificationRepository } from "../../../domain/interface/repositoryInterface/INotificationRepository";
import { Notification } from "../../../domain/entities/NotificationEntity";
import { NotificationType } from "../../../shared/enums/Notification";
import { AppError } from "../../../shared/errors/AppError";


const { NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR, PAYMENT_REQUIRED } = HttpStatusCode;
const { DATA_MISMATCH, NOT_FOUND_MSG, INSUFFICIENT_BALANCE, INTERNAL_ERROR, INVARIANT_VIOLATION_MISSING_FIELD } = Messages;

export class WalletPaymentUseCase implements IWalletPaymentUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _walletRepository: IWalletRepository,
        private readonly _notificationService: INotificationService,
        private readonly _notificationRepository: INotificationRepository,
        private readonly _bookingSchedulerService: IBookingSchedulerService,
        // private readonly _sendBookingConfirmedNotificationUseCase: ISendBookingConfirmedNotificationUseCase
    ) { }

    private async sendBookingConfirmedNotification(input: SendBookingConfirmedInput): Promise<void> {
        try {
            const { userId, title, message, metadata } = input;

            const notification: Notification = {
                notificationId: uuidv4(),
                userId, //reciver
                type: NotificationType.BOOKING_CONFIRMED,
                title,
                message,
                metadata,
                isRead: false,
                createdAt: new Date(),
            };

            await this._notificationRepository.save(notification);

            await this._notificationService.send(userId, {
                // notificationId: notification.notificationId,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                metadata: notification.metadata,
                createdAt: notification.createdAt,
                isRead: notification.isRead,
            });

        } catch (error: unknown) {
            throw error;
        }
    }

    async execute(input: WalletPaymentInputDTO): Promise<WalletPaymentOutputDTO> {
        try {

            const { userId, bookingId } = input;
            let booking = await this._bookingRepository.findByBookingId(bookingId);

            if (!booking) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));
            if (booking.userId !== userId) throw new AppError(BAD_REQUEST, DATA_MISMATCH);


            const wallet = await this._walletRepository.findByUserId(userId);
            if (!wallet) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Wallet"));
            const totalAmount = booking.pricing.baseCost + booking.pricing.distanceFee;
            if (wallet.balance < totalAmount) throw new AppError(PAYMENT_REQUIRED, INSUFFICIENT_BALANCE);

            const transactionId = `Wlt_${uuidv4()}`;

            try {
                await this._walletRepository.updateWalletOnTransaction({
                    userId: userId,
                    transactionId,
                    amount: totalAmount,
                    status: TransactionStatus.SUCCESS,
                    type: TransactionType.DEBIT,
                    metadata: {
                        bookingId: booking.bookingId
                    }
                });
            } catch (error:unknown) {
                await this._walletRepository.updateWalletOnTransaction({
                    userId: userId,
                    transactionId,
                    amount: totalAmount,
                    status: TransactionStatus.FAILED,
                    type: TransactionType.DEBIT,
                    reason: "Wallet Payment failed",
                    metadata: {
                        bookingId: booking.bookingId
                    }
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

                throw error;
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
                workProof: []
            };

            let updatedBooking: Booking | null;
            try {

                updatedBooking = await this._bookingRepository.updateBooking(bookingId, updateData);
                if (!updatedBooking) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));
                if (!updatedBooking.paymentInfo) throw new AppError(INTERNAL_SERVER_ERROR, INTERNAL_ERROR, INVARIANT_VIOLATION_MISSING_FIELD("updatedBooking.paymentInfo"));

                const jobKey = `paymentBooking-${updatedBooking.bookingId}`;
                this._bookingSchedulerService.cancel(jobKey);

            } catch (error: unknown) {

                await this._walletRepository.updateWalletOnTransaction({
                    userId,
                    transactionId: `Rfd-${transactionId}`,
                    amount: totalAmount,
                    status: TransactionStatus.SUCCESS,
                    type: TransactionType.CREDIT,
                    reason: "Refund due to booking update failure",
                    metadata: {
                        bookingId: booking.bookingId
                    }
                });

                throw error;
            }


            //to user
            await this.sendBookingConfirmedNotification({
                userId: updatedBooking.userId,
                title: "Booking Confirmed",
                message: `Your booking has been confirmed for ${updatedBooking.scheduledAt.toLocaleString()}.`,
                metadata: {
                    bookingId: updatedBooking.bookingId,
                    scheduledAt: updatedBooking.scheduledAt,
                    status: updatedBooking.status,
                }
            });

            //to provider
            await this.sendBookingConfirmedNotification({
                userId: updatedBooking.providerUserId,
                title: "New Booking",
                message: "You have a new booking",
                metadata: {
                    bookingId: updatedBooking.bookingId,
                    scheduledAt: updatedBooking.scheduledAt,
                    status: updatedBooking.status,
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

        } catch (error: unknown) {
            throw error;
        }
    }
}