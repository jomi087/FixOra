import { v4 as uuidv4 } from "uuid";

import { Booking } from "../../../domain/entities/BookingEntity";
import { IAvailabilityRepository } from "../../../domain/interface/repositoryInterface/IAvailabilityRepository";
import { IBookingRepository } from "../../../domain/interface/repositoryInterface/IBookingRepository";
import { IProviderRepository } from "../../../domain/interface/repositoryInterface/IProviderRepository";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IWalletRepository";
import { DAYS } from "../../../shared/const/constants";
import { HttpStatusCode } from "../../../shared/enumss/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { toggleAvailabilityInputDTO } from "../../dtos/AvailabilityDTO";
import { IToggleAvailabilityUseCase } from "../../Interface/useCases/provider/IToggleAvailabilityUseCase";
import { TransactionStatus, TransactionType } from "../../../shared/enumss/Transaction";
import { PaymentStatus } from "../../../shared/enumss/Payment";
import { BookingStatus } from "../../../shared/enumss/BookingStatus";
import { SendBookingCancelledInput } from "../../dtos/NotificationDTO";
import { NotificationType } from "../../../shared/enumss/Notification";
import { INotificationRepository } from "../../../domain/interface/repositoryInterface/INotificationRepository";
import { Notification } from "../../../domain/entities/NotificationEntity";
import { INotificationService } from "../../../domain/interface/serviceInterface/INotificationService";
import { AppError } from "../../../shared/errors/AppError";

const { NOT_FOUND, INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { NOT_FOUND_MSG, INTERNAL_ERROR, INVARIANT_VIOLATION_MISSING_FIELD } = Messages;

export class ToggleAvailabilityUseCase implements IToggleAvailabilityUseCase {
    constructor(
        private readonly _providerRepository: IProviderRepository,
        private readonly _availabilityRepository: IAvailabilityRepository,
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

    async execute(input: toggleAvailabilityInputDTO): Promise<void> {
        try {
            const { day, providerUserId, leaveOption } = input;
            let provider = await this._providerRepository.findByUserId(providerUserId);
            if (!provider) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Provider"));

            let availability = await this._availabilityRepository.getProviderAvialability(provider.providerId);
            if (!availability) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Availability"));

            const daySchedule = availability.workTime.find(d => d.day === day);
            if (!daySchedule) {
                throw new AppError(NOT_FOUND, `No schedule found for ${day}`);
            }

            if (leaveOption) {
                let bookingsToCancel: Booking[] = [];

                if (leaveOption == "every_week") {
                    const dayIndex = DAYS.indexOf(day);
                    bookingsToCancel = await this._bookingRepository.findBookingsByWeekday(providerUserId, dayIndex);
                } // else if (leaveOption == "this_week") {}

                for (const bookingData of bookingsToCancel) {

                    if (!bookingData.paymentInfo) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));

                    //wallet logic
                    let wallet = await this._walletRepository.findByUserId(bookingData.userId);
                    if (!wallet) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Wallet"));

                    const transactionId = `Wlt_${uuidv4()}`;
                    const numAmount = Number(bookingData.esCrowAmout);

                    //updating user wallet with full refund
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
                            reason: "Provider is Not Avalialble - refunded 100%"
                        },
                        status: BookingStatus.CANCELLED,
                        esCrowAmout: 0,
                        cancelledAt: new Date()
                    };

                    const updatedBooking = await this._bookingRepository.updateBooking(bookingData.bookingId, updateData);
                    if (!updatedBooking) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));
                    if (!updatedBooking.paymentInfo) throw new AppError(
                        INTERNAL_SERVER_ERROR,
                        INTERNAL_ERROR,
                        INVARIANT_VIOLATION_MISSING_FIELD("updatedBooking.paymentInfo")
                    );


                    await this.sendBookingCancelledNotification({
                        userId: updatedBooking.providerUserId,
                        title: "Booking Cancelled",
                        message: `${updatedBooking.scheduledAt.toLocaleString()} Booking is been Cancelled `,
                        metadata: {
                            bookingId: updatedBooking.bookingId,
                        }
                    });

                    await this.sendBookingCancelledNotification({
                        userId: updatedBooking.userId,
                        title: "Booking Cancelled",
                        message: `${updatedBooking.scheduledAt.toLocaleString()} Booking is been Cancelled `,
                        metadata: {
                            bookingId: updatedBooking.bookingId,
                        }
                    });
                }
            }

            await this._availabilityRepository.toogleAvailability(provider.providerId, day, !daySchedule.active);

        } catch (error: unknown) {
            throw error;
        }


    }
}