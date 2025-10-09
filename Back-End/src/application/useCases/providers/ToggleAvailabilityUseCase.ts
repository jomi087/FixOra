import { v4 as uuidv4 } from "uuid";

import { Booking } from "../../../domain/entities/BookingEntity";
import { IAvailabilityRepository } from "../../../domain/interface/RepositoryInterface/IAvailabilityRepository";
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository";
import { IWalletRepository } from "../../../domain/interface/RepositoryInterface/IWalletRepository";
import { days } from "../../../shared/const/constants";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { toggleAvailabilityInputDTO } from "../../DTO's/AvailabilityDTO";
import { IToggleAvailabilityUseCase } from "../../Interface/useCases/Provider/IToggleAvailabilityUseCase";
import { TransactionStatus, TransactionType } from "../../../shared/enums/Transaction";
import { PaymentStatus } from "../../../shared/enums/Payment";
import { BookingStatus } from "../../../shared/enums/BookingStatus";
import { SendBookingCancelledInput } from "../../DTO's/NotificationDTO";
import { NotificationType } from "../../../shared/enums/Notification";
import { INotificationRepository } from "../../../domain/interface/RepositoryInterface/INotificationRepository";
import { Notification } from "../../../domain/entities/NotificationEntity";
import { INotificationService } from "../../../domain/interface/ServiceInterface/INotificationService";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, PROVIDER_NOT_FOUND, WALLET_ID_NOT_FOUND, NOT_FOUND_MSG } = Messages;

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

        } catch (error) {
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }

    async execute(input: toggleAvailabilityInputDTO): Promise<void> {
        try {
            const { day, providerUserId, leaveOption } = input;
            let provider = await this._providerRepository.findByUserId(providerUserId);
            if (!provider) throw { status: NOT_FOUND, message: PROVIDER_NOT_FOUND };

            let availability = await this._availabilityRepository.getProviderAvialability(provider.providerId);
            if (!availability) throw { status: NOT_FOUND, message: "Availability not found" };

            const daySchedule = availability.workTime.find(d => d.day === day);
            if (!daySchedule) {
                throw { status: NOT_FOUND, message: `No schedule found for ${day}` };
            }

            if (leaveOption) {
                let bookingsToCancel: Booking[] = [];

                if (leaveOption == "every_week") {
                    const dayIndex = days.indexOf(day);
                    bookingsToCancel = await this._bookingRepository.findBookingsByWeekday(providerUserId, dayIndex);
                } // else if (leaveOption == "this_week") {}

                for (const bookingData of bookingsToCancel) {

                    if (!bookingData.paymentInfo) throw { status: NOT_FOUND, message: NOT_FOUND_MSG };

                    //wallet logic
                    let wallet = await this._walletRepository.findByUserId(bookingData.userId);
                    if (!wallet) throw { status: NOT_FOUND, message: WALLET_ID_NOT_FOUND };

                    const transactionId = `Wlt_${uuidv4()}`;
                    const numAmount = Number(bookingData.esCrowAmout);

                    //updating user wallet with full refund
                    await this._walletRepository.updateWalletOnTransaction({
                        userId: bookingData.userId,
                        transactionId,
                        amount: numAmount,
                        status: TransactionStatus.SUCCESS,
                        type: TransactionType.REFUND,
                        reason: `Booking cancellation refund, for booking ${bookingData.bookingId}`
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
                    if (!updatedBooking || !updatedBooking.paymentInfo) throw { status: NOT_FOUND, message: NOT_FOUND_MSG };

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

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }


    }
}