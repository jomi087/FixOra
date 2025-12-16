import { v4 as uuidv4 } from "uuid";

import { Notification } from "../../../domain/entities/NotificationEntity";
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { INotificationRepository } from "../../../domain/interface/RepositoryInterface/INotificationRepository";
import { IWalletRepository } from "../../../domain/interface/RepositoryInterface/IWalletRepository";
import { IBookingSchedulerService } from "../../../domain/interface/ServiceInterface/IBookingSchedulerService";
import { INotificationService } from "../../../domain/interface/ServiceInterface/INotificationService";
import { IPaymentService } from "../../../domain/interface/ServiceInterface/IPaymentService";
import { BookingStatus } from "../../../shared/enums/BookingStatus";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { NotificationType } from "../../../shared/enums/Notification";
import { PaymentMode, PaymentStatus } from "../../../shared/enums/Payment";
import { TransactionStatus, TransactionType } from "../../../shared/enums/Transaction";
import { Messages } from "../../../shared/const/Messages";
import { SendBookingConfirmedInput } from "../../DTOs/NotificationDTO";
import { IVerifyPaymentUseCase } from "../../Interface/useCases/Client/IVerifyPaymentUseCase";
import { AppError } from "../../../shared/errors/AppError";
// import { ISendBookingConfirmedNotificationUseCase } from "../../Interface/useCases/Notificiation/ISendBookingConfirmedNotificationUseCase";
// import { SendBookingCancelledNotificationUseCase } from "../Notificiations/SendBookingCancelledNotificationUseCase";


const { NOT_FOUND, INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { NOT_FOUND_MSG, INTERNAL_ERROR, INVARIANT_VIOLATION_MISSING_FIELD } = Messages;


export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
    constructor(
        private readonly _paymentService: IPaymentService,
        private readonly _notificationService: INotificationService,
        private readonly _bookingRepository: IBookingRepository,
        private readonly _walletRepository: IWalletRepository,
        private readonly _bookingSchedulerService: IBookingSchedulerService,
        private readonly _notificationRepository: INotificationRepository,
        // private readonly _sendBookingConfirmedNotificationUseCase: ISendBookingConfirmedNotificationUseCase,
        // private readonly _sendBookingCancelledNotificationUseCase: SendBookingCancelledNotificationUseCase    
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

    async execute(rawBody: Buffer, signature: string): Promise<void> {
        try {
            const result = await this._paymentService.verifyPayment(rawBody, signature);
            if (!result) return;
            const { eventType, id, transactionId, amount, reason } = result;
            // console.log(transactionId,"transactionID");
            if (eventType === "booking_success") {
                const booking = await this._bookingRepository.findByBookingId(id);
                if (!booking) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));
                const totalAmount = booking.pricing.baseCost + booking.pricing.distanceFee;
                const updateData = {
                    paymentInfo: {
                        mop: PaymentMode.ONLINE,
                        status: PaymentStatus.SUCCESS,
                        paidAt: new Date(),
                        transactionId,
                    },
                    status: BookingStatus.CONFIRMED,
                    esCrowAmout: totalAmount,
                    workProof: []
                };

                //pending: instead of updtedBooking get the Booking data with userName and providerName 
                const updatedBooking = await this._bookingRepository.updateBooking(id, updateData);
                if (!updatedBooking) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));


                const jobKey = `paymentBooking-${id}`;
                this._bookingSchedulerService.cancel(jobKey);

                //to user
                setTimeout(async () => {
                    await this.sendBookingConfirmedNotification({
                        userId: updatedBooking.userId,
                        title: "Booking Confirmed",
                        message: `Your booking has been confirmed for ${updatedBooking.scheduledAt.toLocaleString()}.`,
                        metadata: {
                            bookingId: updatedBooking.bookingId,
                        }
                    });
                }, 5000);

                //to provider
                await this.sendBookingConfirmedNotification({
                    userId: updatedBooking.providerUserId,
                    title: "New Booking",
                    message: "You have a new booking",
                    metadata: {
                        bookingId: updatedBooking.bookingId,
                        scheduledAt: updatedBooking.scheduledAt,
                        status: updatedBooking.status,
                        workProof: []
                    }
                });
            }

            if (eventType === "booking_failed") {

                const booking = await this._bookingRepository.findByBookingId(id);
                if (!booking) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));

                const updateData = {
                    paymentInfo: {
                        mop: PaymentMode.ONLINE,
                        status: PaymentStatus.FAILED,
                        paidAt: new Date(),
                        transactionId,
                        reason: reason || "Payment failed"
                    },
                    status: BookingStatus.CANCELLED,
                    cancelledAt: new Date()
                };

                const updatedBooking = await this._bookingRepository.updateBooking(id, updateData);
                if (!updatedBooking) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));


                const jobKey = `paymentBooking-${id}`;
                this._bookingSchedulerService.cancel(jobKey);

                // setTimeout(() => {
                //     this._notificationService.//notifyPaymentFailureToUser(
                //         updatedBooking.userId,
                //         updatedBooking.paymentInfo?.reason || "Payment failed",
                //     );
                // }, 5000);
            }

            if (eventType === "wallet_success") {

                const wallet = await this._walletRepository.findByUserId(id);
                if (!wallet) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Wallet"));

                if (!amount) throw new AppError(INTERNAL_SERVER_ERROR, INTERNAL_ERROR, INVARIANT_VIOLATION_MISSING_FIELD("amount"));

                const numAmount = Number(amount);
                await this._walletRepository.updateWalletOnTransaction({
                    userId: id,
                    transactionId,
                    amount: numAmount,
                    status: TransactionStatus.SUCCESS,
                    type: TransactionType.CREDIT,
                });
                
                setTimeout(() => {
                    this._notificationService.notifyPaymentSuccessToUser(id);
                }, 5000);
            }

            if (eventType === "wallet_failed") {
                const wallet = await this._walletRepository.findByUserId(id);
                if (!wallet) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Wallet"));

                const numAmount = Number(amount) || 0;
                await this._walletRepository.updateWalletOnTransaction({
                    userId: id,
                    transactionId,
                    amount: numAmount,
                    status: TransactionStatus.FAILED,
                    type: TransactionType.CREDIT,
                    reason: reason || "Payment failed"
                });

                setTimeout(() => {
                    this._notificationService.notifyPaymentFailureToUser(
                        id,
                        reason || "Payment failed",
                    );
                }, 5000);
            }

        } catch (error: unknown) {
            throw error;
        }
    }


}  