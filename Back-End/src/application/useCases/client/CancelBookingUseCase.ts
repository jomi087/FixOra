import { v4 as uuidv4 } from "uuid";
import { IBookingRepository } from "../../../domain/interface/repositoryInterface/IBookingRepository";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IWalletRepository";
import { INotificationService } from "../../../domain/interface/serviceInterface/INotificationService";
import { FULL_REFUND_WINDOW_MINUTES, PARTIAL_REFUND_PERCENTAGE } from "../../../shared/const/constants";
import { BookingStatus } from "../../../shared/enums/BookingStatus";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { PaymentStatus } from "../../../shared/enums/Payment";
import { TransactionStatus, TransactionType } from "../../../shared/enums/Transaction";
import { Messages } from "../../../shared/const/Messages";
import { CancelBookingInputDTO, CancelBookingOutputDTO } from "../../dtos/BookingDTO/BookingInfoDTO";
import { ICancelBookingUseCase } from "../../interface/useCases/client/ICancelBookingUseCase";
import { SendBookingCancelledInput } from "../../dtos/NotificationDTO";
import { Notification } from "../../../domain/entities/NotificationEntity";
import { NotificationType } from "../../../shared/enums/Notification";
import { INotificationRepository } from "../../../domain/interface/repositoryInterface/INotificationRepository";
import { AppError } from "../../../shared/errors/AppError";


const { NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { BOOKING_ALREADY_CANCELLED, NOT_FOUND_MSG,
    DATA_MISMATCH, INTERNAL_ERROR, INVARIANT_VIOLATION_MISSING_FIELD,
} = Messages;

export class CancelBookingUseCase implements ICancelBookingUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _walletRepository: IWalletRepository,
        private readonly _notificationService: INotificationService,
        private readonly _notificationRepository: INotificationRepository,
    ) { }

    private async sendBookingCancelledNotification(input: SendBookingCancelledInput): Promise<void> {
        try {
            const { userId, title, message, metadata } = input;

            const notification: Notification = {
                notificationId: uuidv4(),
                userId, //reciver
                type: NotificationType.BOOKING_CANCELLED,
                title,
                message,
                metadata,
                isRead: false,
                createdAt: new Date(),
            };

            await this._notificationRepository.save(notification);

            await this._notificationService.send(userId, {
                //notificationId: notification.notificationId,
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

    async execute(input: CancelBookingInputDTO): Promise<CancelBookingOutputDTO> {
        try {
            const { userId, bookingId } = input;

            const bookingData = await this._bookingRepository.findByBookingId(bookingId);
            if (!bookingData) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));
            };

            if (bookingData.userId !== userId) throw new AppError(BAD_REQUEST, DATA_MISMATCH);


            if (!bookingData.paymentInfo) {
                throw new AppError(INTERNAL_SERVER_ERROR,
                    INTERNAL_ERROR,
                    INVARIANT_VIOLATION_MISSING_FIELD("bookingData.paymentInfo"));
            }
            if (bookingData.status === BookingStatus.CANCELLED) {
                throw new AppError(BAD_REQUEST, BOOKING_ALREADY_CANCELLED);
            }

            const bookedAt: Date = bookingData.paymentInfo!.paidAt;
            const scheduledAt: Date = bookingData.scheduledAt;
            const now = new Date();

            // Calculate how many minutes have passed since booking
            const minutesSinceBooking = (now.getTime() - bookedAt.getTime()) / (1000 * 60);

            // Check refund eligibility
            const isFullRefundEligible = minutesSinceBooking <= FULL_REFUND_WINDOW_MINUTES && now < scheduledAt;

            if (isFullRefundEligible) {
                let wallet = await this._walletRepository.findByUserId(bookingData.userId);
                if (!wallet) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Wallet"));

                const transactionId = `Wlt_${uuidv4()}`;
                const numAmount = Number(bookingData.esCrowAmout);

                //updating user wallet will full refund
                await this._walletRepository.updateWalletOnTransaction({
                    userId: bookingData.userId,
                    transactionId,
                    amount: numAmount,
                    status: TransactionStatus.SUCCESS,
                    type: TransactionType.REFUND,
                    reason: `Booking cancellation refund, for booking ${bookingData.bookingId}`,
                    metadata: {
                        bookingId: bookingData.bookingId
                    }
                });

                //updating booking data
                const updateData = {
                    paymentInfo: {
                        mop: bookingData.paymentInfo.mop,
                        status: PaymentStatus.REFUNDED,
                        paidAt: new Date(),
                        transactionId: bookingData.paymentInfo.transactionId,
                        reason: "User Canceled the Booking - refunded 100%"
                    },
                    status: BookingStatus.CANCELLED,
                    esCrowAmout: 0,
                    cancelledAt: new Date()
                };

                const updatedBooking = await this._bookingRepository.updateBooking(bookingId, updateData);
                if (!updatedBooking) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));
                if (!updatedBooking.paymentInfo) throw new AppError(INTERNAL_SERVER_ERROR, INTERNAL_ERROR, INVARIANT_VIOLATION_MISSING_FIELD("updatedBooking.paymentInfo"));

                await this.sendBookingCancelledNotification({
                    userId: updatedBooking.providerUserId,
                    title: "Booking Cancelled",
                    message: `${updatedBooking.scheduledAt.toLocaleString()} Booking is been Cancelled `,
                    metadata: {
                        bookingId: updatedBooking.bookingId,
                    }
                });

                return {
                    status: updatedBooking.status,
                    paymentInfo: {
                        status: updatedBooking.paymentInfo.status,
                        reason: updatedBooking.paymentInfo.reason || "User Canceled the Booking"
                    }
                };

            } else {

                const transactionId = `Wlt_${uuidv4()}`;
                const numAmount = Number(bookingData.esCrowAmout);

                const halfRefund = Math.round(numAmount * PARTIAL_REFUND_PERCENTAGE);
                const providerAmount = halfRefund - bookingData.commission;

                //updating user wallet will partial refund (50%)
                await this._walletRepository.updateWalletOnTransaction({
                    userId: bookingData.userId,
                    transactionId: `user50${transactionId}`,
                    amount: halfRefund,
                    status: TransactionStatus.SUCCESS,
                    type: TransactionType.REFUND,
                    reason: `Booking cancellation refund for booking ${bookingData.bookingId}`,
                    metadata: {
                        bookingId: bookingData.bookingId
                    }
                });

                //updating provider wallet will partial refund (50% -  commission fee)
                await this._walletRepository.updateWalletOnTransaction({
                    userId: bookingData.providerUserId,
                    transactionId: `prvdr50${transactionId}`,
                    amount: providerAmount,
                    status: TransactionStatus.SUCCESS,
                    type: TransactionType.CREDIT,
                    reason: `Booking cancellation compensation for booking ${bookingData.bookingId}`,
                    metadata: {
                        bookingId: bookingData.bookingId
                    }
                });

                //updating booking data
                const updateData = {
                    paymentInfo: {
                        mop: bookingData.paymentInfo.mop,
                        status: PaymentStatus.PARTIAL_REFUNDED,
                        paidAt: new Date(),
                        transactionId: bookingData.paymentInfo.transactionId,
                        reason: "User Canceled the Booking - refunded 50%"
                    },
                    status: BookingStatus.CANCELLED,
                    esCrowAmout: 0,
                    cancelledAt: new Date()
                };

                const updatedBooking = await this._bookingRepository.updateBooking(bookingId, updateData);
                if (!updatedBooking) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));
                if (!updatedBooking.paymentInfo) throw new AppError(INTERNAL_SERVER_ERROR, INTERNAL_ERROR, INVARIANT_VIOLATION_MISSING_FIELD("updatedBooking.paymentInfo"));

                await this.sendBookingCancelledNotification({
                    userId: updatedBooking.providerUserId,
                    title: "Booking Cancelled",
                    message: `${updatedBooking.scheduledAt.toLocaleString()} Booking is been Cancelled `,
                    metadata: {
                        bookingId: updatedBooking.bookingId,
                    }
                });

                return {
                    status: updatedBooking.status,
                    paymentInfo: {
                        status: updatedBooking.paymentInfo.status,
                        reason: updatedBooking.paymentInfo.reason || "User Canceled the Booking"
                    }
                };
            }

        } catch (error: unknown) {
            throw error;
        }
    }
}
