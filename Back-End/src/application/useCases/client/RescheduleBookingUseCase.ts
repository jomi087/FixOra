import { v4 as uuidv4 } from "uuid";
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { DAYS } from "../../../shared/const/constants";
import { ProviderResponseStatus } from "../../../shared/enums/ProviderResponse";
import { IAvailabilityRepository } from "../../../domain/interface/RepositoryInterface/IAvailabilityRepository";
import { RescheduleBookingInputDTO } from "../../DTOs/BookingDTO/RescheduleBooking";
import { IRescheduleBookingUseCase } from "../../Interface/useCases/Client/IRescheduleBookingUseCase";
import { SendBookingConfirmedInput } from "../../DTOs/NotificationDTO";
import { Notification } from "../../../domain/entities/NotificationEntity";
import { NotificationType } from "../../../shared/enums/Notification";
import { INotificationService } from "../../../domain/interface/ServiceInterface/INotificationService";
import { INotificationRepository } from "../../../domain/interface/RepositoryInterface/INotificationRepository";

const { INTERNAL_SERVER_ERROR, CONFLICT, NOT_FOUND, UNPROCESSABLE_ENTITY } = HttpStatusCode;
const { INTERNAL_ERROR, ALREDY_BOOKED, PENDING_BOOKING, BOOKING_ID_NOT_FOUND, NOT_FOUND_MSG } = Messages;

export class RescheduleBookingUseCase implements IRescheduleBookingUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _availabilityRepository: IAvailabilityRepository,
        private readonly _notificationService: INotificationService,
        private readonly _notificationRepository: INotificationRepository,
    ) { }

    private async sendBookingConfirmedNotification(input: SendBookingConfirmedInput): Promise<void> {
        try {
            const { userId, title, message, metadata } = input;

            const notification: Notification = {
                notificationId: uuidv4(),
                userId, //reciver
                type: NotificationType.BOOKING_RESCHEDULED,
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

        } catch (error) {
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }

    async execute(input: RescheduleBookingInputDTO): Promise<Date> {
        try {

            const booking = await this._bookingRepository.findByBookingId(input.bookingId);
            if (!booking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

            const prevScheduledAt: Date = booking.scheduledAt;
            const rescheduledAt: Date = new Date(input.rescheduledAt);


            let CheckExistingNoRejectedBooking = await this._bookingRepository.findExistingBooking(booking.provider.id, rescheduledAt);

            // console.log(CheckExistingNoRejectedBooking)
            if (CheckExistingNoRejectedBooking && (CheckExistingNoRejectedBooking.provider.response === ProviderResponseStatus.PENDING)) {
                throw { status: CONFLICT, message: PENDING_BOOKING };
            } else if (CheckExistingNoRejectedBooking) {
                throw { status: CONFLICT, message: ALREDY_BOOKED };
            }

            let availability = await this._availabilityRepository.getProviderAvialability(booking.provider.id);
            if (!availability) throw { status: NOT_FOUND, message: "Availability not found" };

            const dayName = DAYS[rescheduledAt.getDay()];

            const hours = rescheduledAt.getHours().toString().padStart(2, "0");
            const minutes = rescheduledAt.getMinutes().toString().padStart(2, "0");
            const timeStr = `${hours}:${minutes}`;

            const daySchedule = availability.workTime.find(d => d.day === dayName && d.active);
            if (!daySchedule) throw { status: CONFLICT, message: "Provider not available on selected day" };

            if (!daySchedule.slots.includes(timeStr)) throw { status: UNPROCESSABLE_ENTITY, message: "Selected time is outside provider’s working hours" };

            const rescheduledBookingData = await this._bookingRepository.updateScheduleDateandTime(input.bookingId, rescheduledAt);
            if (!rescheduledBookingData) throw { status: NOT_FOUND, message: NOT_FOUND_MSG };

            await this.sendBookingConfirmedNotification({
                userId: rescheduledBookingData.providerUserId,
                title: "Booking Re-Scheduled",
                message: `Booking on ${prevScheduledAt.toLocaleString()} has been rescheduled to ${rescheduledAt.toLocaleString()} `,
                metadata: {
                    bookingId: rescheduledBookingData.bookingId,
                    scheduledAt: rescheduledBookingData.scheduledAt,
                    status: rescheduledBookingData.status,
                }
            });

            return rescheduledBookingData.scheduledAt;

        } catch (error) {
            console.log(error);
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}

