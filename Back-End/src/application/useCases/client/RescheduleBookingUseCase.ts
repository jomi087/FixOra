import { v4 as uuidv4 } from "uuid";
import { IBookingRepository } from "../../../domain/interface/repositoryInterface/IBookingRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { DAYS } from "../../../shared/const/constants";
import { ProviderResponseStatus } from "../../../shared/enums/ProviderResponse";
import { IAvailabilityRepository } from "../../../domain/interface/repositoryInterface/IAvailabilityRepository";
import { RescheduleBookingInputDTO } from "../../dtos/BookingDTO/RescheduleBooking";
import { IRescheduleBookingUseCase } from "../../interfacetemp/useCases/client/IRescheduleBookingUseCase";
import { SendBookingConfirmedInput } from "../../dtos/NotificationDTO";
import { Notification } from "../../../domain/entities/NotificationEntity";
import { NotificationType } from "../../../shared/enums/Notification";
import { INotificationService } from "../../../domain/interface/serviceInterface/INotificationService";
import { INotificationRepository } from "../../../domain/interface/repositoryInterface/INotificationRepository";
import { AppError } from "../../../shared/errors/AppError";

const { CONFLICT, NOT_FOUND, UNPROCESSABLE_ENTITY } = HttpStatusCode;
const { ALREDY_BOOKED, PENDING_BOOKING, TIME_OUTSIDE_PROVIDER_WORKING_HOURS,
    PROVIDER_UNAVAILABLE_FOR_SELECTED_DAY, NOT_FOUND_MSG
} = Messages;

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

        } catch (error: unknown) {
            throw error;
        }
    }

    async execute(input: RescheduleBookingInputDTO): Promise<Date> {
        try {

            const booking = await this._bookingRepository.findByBookingId(input.bookingId);
            if (!booking) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));

            const prevScheduledAt: Date = booking.scheduledAt;
            const rescheduledAt: Date = new Date(input.rescheduledAt);


            let CheckExistingNoRejectedBooking = await this._bookingRepository.findExistingBooking(booking.provider.id, rescheduledAt);

            if (CheckExistingNoRejectedBooking && (CheckExistingNoRejectedBooking.provider.response === ProviderResponseStatus.PENDING)) {
                throw new AppError(CONFLICT, PENDING_BOOKING);

            } else if (CheckExistingNoRejectedBooking) {
                throw new AppError(CONFLICT, ALREDY_BOOKED);

            }

            let availability = await this._availabilityRepository.getProviderAvialability(booking.provider.id);
            if (!availability) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Availability"));

            const dayName = DAYS[rescheduledAt.getDay()];

            const hours = rescheduledAt.getHours().toString().padStart(2, "0");
            const minutes = rescheduledAt.getMinutes().toString().padStart(2, "0");
            const timeStr = `${hours}:${minutes}`;

            const daySchedule = availability.workTime.find(d => d.day === dayName && d.active);
            if (!daySchedule) throw new AppError(CONFLICT, PROVIDER_UNAVAILABLE_FOR_SELECTED_DAY);


            if (!daySchedule.slots.includes(timeStr)) throw new AppError(UNPROCESSABLE_ENTITY, TIME_OUTSIDE_PROVIDER_WORKING_HOURS);

            const rescheduledBookingData = await this._bookingRepository.updateScheduleDateandTime(input.bookingId, rescheduledAt);
            if (!rescheduledBookingData)  throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Bookng"));


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

        } catch (error: unknown) {
            throw error;
        }
    }
}

