import { Booking } from "../../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../../domain/interface/repositoryInterface/IBookingRepository";
import { Messages } from "../../../shared/const/Messages";
import { BookingStatus } from "../../../shared/enums/BookingStatus";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { CreateBookingApplicationInputDTO, CreateBookingApplicationOutputDTO } from "../../dtos/BookingDTO/CreateBookingApplicationDTO";
import { IBookingUseCase } from "../../interface/useCases/client/IBookingUseCase";
import { v4 as uuidv4 } from "uuid";
import { INotificationService } from "../../../domain/interface/serviceInterface/INotificationService";
import { BOOKING_REQUEST_TIMEOUT_MS, DAYS } from "../../../shared/const/constants";
import { IBookingSchedulerService } from "../../../domain/interface/serviceInterface/IBookingSchedulerService";
import { ProviderResponseStatus } from "../../../shared/enums/ProviderResponse";
import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { IAvailabilityRepository } from "../../../domain/interface/repositoryInterface/IAvailabilityRepository";
import { IPushNotificationService } from "../../../domain/interface/serviceInterface/IPushNotificationService";
import { ICommissionFeeRepository } from "../../../domain/interface/repositoryInterface/ICommissionFeeRepository";
import { AppError } from "../../../shared/errors/AppError";

const { CONFLICT, NOT_FOUND, UNPROCESSABLE_ENTITY, BAD_REQUEST } = HttpStatusCode;
const { ALREDY_BOOKED, PENDING_BOOKING, NOT_FOUND_MSG, PROVIDER_NO_RESPONSE, TIME_OUTSIDE_PROVIDER_WORKING_HOURS,
    PROVIDER_UNAVAILABLE_FOR_SELECTED_DAY, INVALID_INPUT, INTERNAL_ERROR } = Messages;

export class BookingUseCase implements IBookingUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _notificationService: INotificationService,
        private readonly _pushNotificationService: IPushNotificationService,
        private readonly _bookingSchedulerService: IBookingSchedulerService,
        private readonly _userRepository: IUserRepository,
        private readonly _availabilityRepository: IAvailabilityRepository,
        private readonly _commissionFeeRepository: ICommissionFeeRepository,
    ) { }

    private scheduleProviderResponseTimeout(bookingId: string): void {
        const jobKey = `providerResponse-${bookingId}`;

        this._bookingSchedulerService.scheduleTimeoutJob(jobKey, bookingId, BOOKING_REQUEST_TIMEOUT_MS, async () => {
            const currentBooking = await this._bookingRepository.findByBookingId(bookingId);

            if (!currentBooking || currentBooking.provider.response !== ProviderResponseStatus.PENDING) return;

            const cancelledAt = new Date();
            let updatedBookingData = await this._bookingRepository.updateProviderResponseAndStatus(
                bookingId,
                BookingStatus.CANCELLED,
                ProviderResponseStatus.REJECTED,
                PROVIDER_NO_RESPONSE,
                cancelledAt
            );

            if (!updatedBookingData) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));


            this._notificationService.notifyBookingResponseToUser(updatedBookingData.userId, {
                bookingId: updatedBookingData.bookingId,
                response: updatedBookingData.provider.response,
                scheduledAt: updatedBookingData.scheduledAt,
                reason: updatedBookingData.provider.reason as string
            });

            this._notificationService.notifyBookingAutoRejectToProvider(updatedBookingData.providerUserId, {
                bookingId: updatedBookingData.bookingId,
                response: updatedBookingData.provider.response,
                reason: updatedBookingData.provider.reason as string
            });
        });
    }

    private async pushNotifcation(userId: string, payload: { title: string, body: string, data?: Record<string, string> }) {
        // fetch all FCM tokens for this user
        const user = await this._userRepository.findByUserId(userId);
        if (!user?.fcmTokens || user.fcmTokens.length === 0) return;

        await this._pushNotificationService.sendPushNotificationToUser(user.fcmTokens, payload);

    }

    async execute(input: CreateBookingApplicationInputDTO): Promise<CreateBookingApplicationOutputDTO> {
        try {
            const scheduledAt: Date = new Date(input.scheduledAt);
            let CheckExistingNoRejectedBooking = await this._bookingRepository.findExistingBooking(input.providerId, scheduledAt);

            if (CheckExistingNoRejectedBooking && (CheckExistingNoRejectedBooking.provider.response === ProviderResponseStatus.ACCEPTED)) {
                throw new AppError(CONFLICT, ALREDY_BOOKED);
            } else if (CheckExistingNoRejectedBooking && (CheckExistingNoRejectedBooking.provider.response === ProviderResponseStatus.PENDING)) {
                throw new AppError(CONFLICT, PENDING_BOOKING);
            }

            let availability = await this._availabilityRepository.getProviderAvialability(input.providerId);
            if (!availability) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Availability"));


            const dayName = DAYS[scheduledAt.getDay()];

            const hours = scheduledAt.getHours().toString().padStart(2, "0");
            const minutes = scheduledAt.getMinutes().toString().padStart(2, "0");
            const timeStr = `${hours}:${minutes}`;

            const daySchedule = availability.workTime.find(d => d.day === dayName && d.active);
            if (!daySchedule)
                throw new AppError(CONFLICT, PROVIDER_UNAVAILABLE_FOR_SELECTED_DAY);

            if (!daySchedule.slots.includes(timeStr)) throw new AppError(UNPROCESSABLE_ENTITY, TIME_OUTSIDE_PROVIDER_WORKING_HOURS);

            let result = await this._userRepository.getServiceChargeWithDistanceFee(input.providerId, input.coordinates);
            if (!result) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("User"));
            }

            const { serviceCharge, distanceFee } = result;

            if (isNaN(serviceCharge) || isNaN(distanceFee)) {
                throw new AppError(BAD_REQUEST, INTERNAL_ERROR, INVALID_INPUT("service charge / distance fee"));
            }

            const commissionFeeData = await this._commissionFeeRepository.findCommissionFeeData();
            if (!commissionFeeData?.fee) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Commission"));

            const commissionFee = commissionFeeData.fee;
            if (isNaN(commissionFee)) {
                throw new AppError(BAD_REQUEST, INTERNAL_ERROR, INVALID_INPUT("commission Fee"));
            }

            const newBooking: Booking = {
                bookingId: uuidv4(),
                userId: input.userId,
                location: {
                    address: input.address,
                    lat: input.coordinates.latitude,
                    lng: input.coordinates.longitude,
                },
                providerUserId: input.providerUserId,
                provider: {
                    id: input.providerId,
                    response: ProviderResponseStatus.PENDING
                },
                scheduledAt: scheduledAt,
                issueTypeId: input.issueTypeId,
                issue: input.issue,
                status: BookingStatus.PENDING,
                pricing: {
                    baseCost: serviceCharge,
                    distanceFee: distanceFee,
                },
                commission: commissionFee
            };

            let bookingId = await this._bookingRepository.create(newBooking);

            const bookingDataInDetails = await this._bookingRepository.findCurrentBookingDetails(bookingId);

            if (!bookingDataInDetails) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));
            }

            const { userInfo, providerInfo, bookingInfo, subCategoryInfo } = bookingDataInDetails;

            let id = providerInfo.userId;

            this._notificationService.notifyBookingRequestToProvider(id, {
                bookingId: bookingInfo.bookingId,
                userName: `${userInfo.fname} ${userInfo.lname}`,
                issueType: `${subCategoryInfo.name}`,
                scheduledAt: bookingInfo.scheduledAt,
                issue: bookingInfo.issue
            });

            //Send push notification as fallback if provider is offline
            await this.pushNotifcation(id, {
                title: "New Booking Request",
                body: `${userInfo.fname} ${userInfo.lname} wants to book a ${subCategoryInfo.name} at ${bookingInfo.scheduledAt.toLocaleString()}`
            });

            this.scheduleProviderResponseTimeout(bookingInfo.bookingId);

            const mappedData: CreateBookingApplicationOutputDTO = {
                bookingId: bookingInfo.bookingId,
                scheduledAt: bookingInfo.scheduledAt,
                status: bookingInfo.status
            };
            return mappedData;

        } catch (error: unknown) {
            throw error;
        }
    }
}

