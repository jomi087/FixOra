import { v4 as uuidv4 } from "uuid";
import { IAvailabilityRepository } from "../../../domain/interface/repositoryInterface/IAvailabilityRepository";
import { IProviderRepository } from "../../../domain/interface/repositoryInterface/IProviderRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { Day } from "../../../shared/types/availability";
import { setAvailabilityInputDTO, setAvailabilityOutputDTO } from "../../dtos/AvailabilityDTO";
import { ISetAvailabilityUseCase } from "../../Interface/useCases/provider/ISetAvailabilityUseCase";
import { DaySchedule } from "../../../domain/entities/AvailabilityEntity";
import { IBookingRepository } from "../../../domain/interface/repositoryInterface/IBookingRepository";
import { DAYS } from "../../../shared/const/constants";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IWalletRepository";
import { INotificationService } from "../../../domain/interface/serviceInterface/INotificationService";
import { INotificationRepository } from "../../../domain/interface/repositoryInterface/INotificationRepository";
import { SendBookingCancelledInput } from "../../dtos/NotificationDTO";
import { TransactionStatus, TransactionType } from "../../../shared/enums/Transaction";
import { BookingStatus } from "../../../shared/enums/BookingStatus";
import { PaymentStatus } from "../../../shared/enums/Payment";
import { Notification } from "../../../domain/entities/NotificationEntity";
import { NotificationType } from "../../../shared/enums/Notification";
import { AppError } from "../../../shared/errors/AppError";

const { NOT_FOUND, INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { NOT_FOUND_MSG, INTERNAL_ERROR, INVARIANT_VIOLATION_MISSING_FIELD } = Messages;

export class SetAvailabilityUseCase implements ISetAvailabilityUseCase {
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

    private getRemovedSlots(oldWorkTime: DaySchedule[], newWorkTime: DaySchedule[]): { day: Day; slots: string[] }[] {

        const removed: { day: Day; slots: string[] }[] = [];

        for (const oldDay of oldWorkTime) {

            const newDay = newWorkTime.find(n => n.day === oldDay.day);
            if (!newDay) continue;

            const oldSlots = oldDay.slots;
            const newSlots = newDay.slots;

            // removed = old minus new
            const removedSlots = oldSlots.filter(s => !newSlots.includes(s));

            if (removedSlots.length > 0) {
                removed.push({
                    day: oldDay.day,
                    slots: removedSlots
                });
            }
        }

        return removed;
    }

    async cancelBookingsForSlots(providerUserId: string, removedSlots: { day: Day; slots: string[] }[]): Promise<void> {

        for (const entry of removedSlots) {
            const { day, slots } = entry;

            const dayIndex = DAYS.indexOf(day);
            for (const slot of slots) {

                const [hour, minute] = slot.split(":").map(Number);

                const local = new Date();
                local.setHours(hour, minute, 0, 0);

                // Convert to UTC; we only keep the hour & minute part
                const utcHour = local.getUTCHours().toString().padStart(2, "0");
                const utcMinute = local.getUTCMinutes().toString().padStart(2, "0");

                const utcStartString = `${utcHour}:${utcMinute}`;

                // End time = +1 hour
                const localEnd = new Date(local.getTime() + 60 * 60 * 1000);
                const utcEndHour = localEnd.getUTCHours().toString().padStart(2, "0");
                const utcEndMinute = localEnd.getUTCMinutes().toString().padStart(2, "0");

                const utcEndString = `${utcEndHour}:${utcEndMinute}`;

                const bookings = await this._bookingRepository.findBookingsByUtcRange(providerUserId, dayIndex, utcStartString, utcEndString);

                for (const booking of bookings) {

                    if (!booking.paymentInfo) throw new AppError(
                        INTERNAL_SERVER_ERROR,
                        INTERNAL_ERROR,
                        INVARIANT_VIOLATION_MISSING_FIELD("updatedBooking.paymentInfo")
                    );

                    let wallet = await this._walletRepository.findByUserId(booking.userId);
                    if (!wallet) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Wallet"));


                    const transactionId = `Wlt_${uuidv4()}`;
                    const numAmount = Number(booking.esCrowAmout);

                    //updating user wallet with full refund
                    await this._walletRepository.updateWalletOnTransaction({
                        userId: booking.userId,
                        transactionId,
                        amount: numAmount,
                        status: TransactionStatus.SUCCESS,
                        type: TransactionType.REFUND,
                        reason: `Booking cancellation refund, for booking ${booking.bookingId}`,
                        metadata: {
                            bookingId: booking.bookingId
                        }
                    });

                    //updating booking data 
                    const updateData = {
                        paymentInfo: {
                            mop: booking.paymentInfo.mop,
                            status: PaymentStatus.REFUNDED,
                            paidAt: new Date(),
                            transactionId: booking.paymentInfo.transactionId,
                            reason: "Provider is Not Avalialble - refunded 100%"
                        },
                        status: BookingStatus.CANCELLED,
                        esCrowAmout: 0,
                        cancelledAt: new Date()
                    };

                    const updatedBooking = await this._bookingRepository.updateBooking(booking.bookingId, updateData);
                    if (!updatedBooking || !updatedBooking.paymentInfo) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));


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
        }
    }


    async execute(input: setAvailabilityInputDTO): Promise<setAvailabilityOutputDTO[]> {

        try {

            let provider = await this._providerRepository.findByUserId(input.providerUserId);
            if (!provider) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Provider"));

            const oldAvailability = await this._availabilityRepository.getProviderAvialability(provider.providerId);
            if (!oldAvailability) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Availability"));

            const newWorkTime = Object.entries(input.schedule)//input.schedule: Record<Day, { slots: string[], active: boolean }>;
                .map(([day, value,]) => ({
                    day: day as Day,
                    slots: [...value.slots].sort((a, b) => {
                        // compare hours and minutes
                        const [ah, am] = a.split(":").map(Number);
                        const [bh, bm] = b.split(":").map(Number);
                        return ah === bh ? am - bm : ah - bh;
                    }),
                    active: value.active
                }));


            const removedSlots = this.getRemovedSlots(oldAvailability.workTime, newWorkTime);

            if (removedSlots.length > 0) {
                await this.cancelBookingsForSlots(input.providerUserId, removedSlots);
            }

            const availability = await this._availabilityRepository.storeWorkingTime(provider.providerId, newWorkTime);
            if (!availability) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Availability"));


            const mappedData: setAvailabilityOutputDTO[] = availability.workTime;
            return mappedData;

        } catch (error: unknown) {
            throw error;
        }
    }
}