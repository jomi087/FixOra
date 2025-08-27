import { Booking } from "../../../domain/entities/BookingEntity.js";
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository.js";
import { Messages } from "../../../shared/Messages.js";
import { BookingStatus } from "../../../shared/Enums/BookingStatus.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { CreateBookingApplicationInputDTO, CreateBookingApplicationOutputDTO } from "../../DTO's/BookingDTO/CreateBookingApplicationDTO.js";
import { IBookingUseCase } from "../../Interface/useCases/Client/IBookingUseCase.js";
import { v4 as uuidv4 } from "uuid";
import { INotificationService } from "../../../domain/interface/ServiceInterface/INotificationService.js";
import { BOOKING_REQUEST_TIMEOUT_MS } from "../../../shared/constants.js";
import { IBookingSchedulerService } from "../../../domain/interface/ServiceInterface/IBookingSchedulerService.js";
import { ProviderResponseStatus } from "../../../shared/Enums/ProviderResponse.js";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";

const { INTERNAL_SERVER_ERROR,CONFLICT,NOT_FOUND} = HttpStatusCode
const { INTERNAL_ERROR,ALREDY_BOOKED,PENDING_BOOKING,NOT_FOUND_MSG,BOOKING_ID_NOT_FOUND,PROVIDER_NO_RESPONSE } = Messages

export class BookingUseCase implements IBookingUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _notificationService: INotificationService,
        private readonly _bookingSchedulerService: IBookingSchedulerService,
        private readonly _userRepository : IUserRepository
    ) { }

    private scheduleProviderResponseTimeout(bookingId:string): void{
        const jobKey = `providerResponse-${bookingId}`;

        this._bookingSchedulerService.scheduleTimeoutJob(jobKey, bookingId, BOOKING_REQUEST_TIMEOUT_MS, async () => {
            const currentBooking = await this._bookingRepository.findByBookingId(bookingId);
            
            if (!currentBooking || currentBooking.provider.response !== ProviderResponseStatus.PENDING) return

            let updatedBookingData = await this._bookingRepository.updateProviderResponseAndStatus(
                bookingId,
                BookingStatus.CANCELLED,
                ProviderResponseStatus.REJECTED,
                PROVIDER_NO_RESPONSE,
            )

            if (!updatedBookingData) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND }

            this._notificationService.notifyBookingResponseToUser(updatedBookingData.userId, {
                bookingId: updatedBookingData.bookingId,
                response : updatedBookingData.provider.response,
                scheduledAt : updatedBookingData.scheduledAt,
                reason: updatedBookingData.provider.reason as string
            });

            this._notificationService.notifyBookingAutoRejectToProvider(updatedBookingData.providerUserId, {
                bookingId: updatedBookingData.bookingId,
                response: updatedBookingData.provider.response,
                reason: updatedBookingData.provider.reason as string
            });
        })
    }
    
    async execute(input: CreateBookingApplicationInputDTO): Promise<CreateBookingApplicationOutputDTO> {
        try {

            let CheckExistingNoRejectedBooking = await this._bookingRepository.findExistingBooking(input.providerId, input.scheduledAt)

            // console.log(CheckExistingNoRejectedBooking)
            if (CheckExistingNoRejectedBooking && (CheckExistingNoRejectedBooking.provider.response  === ProviderResponseStatus.ACCEPTED)) {
                throw { status: CONFLICT, message: ALREDY_BOOKED }
            } else if (CheckExistingNoRejectedBooking && (CheckExistingNoRejectedBooking.provider.response  === ProviderResponseStatus.PENDING)) {
                throw { status: CONFLICT, message: PENDING_BOOKING }
            }
            
            let result = await this._userRepository.getServiceChargeWithDistanceFee(input.providerId,input.coordinates)
            if (!result) {
                throw { status: NOT_FOUND, message: NOT_FOUND_MSG };
            }

            const { serviceCharge, distanceFee } = result ;
            
            if (isNaN(serviceCharge) || isNaN(distanceFee)) {
                throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
            }

            const newBooking: Booking = {
                bookingId: uuidv4(),
                userId: input.userId,
                providerUserId: input.providerUserId,
                provider: {
                    id: input.providerId,
                    response : ProviderResponseStatus.PENDING
                },
                scheduledAt: input.scheduledAt,
                issueTypeId: input.issueTypeId,
                issue: input.issue,
                status: BookingStatus.PENDING,
                pricing: {
                    baseCost: serviceCharge,
                    distanceFee : distanceFee,
                },
            }

            let bookingId = await this._bookingRepository.create(newBooking)
            
            const bookingDataInDetails = await this._bookingRepository.findCurrentBookingDetails(bookingId)

            if (!bookingDataInDetails) {
                throw { status: NOT_FOUND, message: NOT_FOUND_MSG };
            }

            const { userInfo, providerInfo, bookingInfo, subCategoryInfo } = bookingDataInDetails

            let id = providerInfo.userId

            this._notificationService.notifyBookingRequestToProvider(id, {
                bookingId: bookingInfo.bookingId,
                userName: `${userInfo.fname} ${userInfo.lname}`,
                issueType: `${subCategoryInfo.name}`,
                scheduledAt : bookingInfo.scheduledAt,
                issue: bookingInfo.issue
            })
            this.scheduleProviderResponseTimeout(bookingInfo.bookingId)

            const mappedData: CreateBookingApplicationOutputDTO = {
                bookingId: bookingInfo.bookingId,
                scheduledAt: bookingInfo.scheduledAt,
                status: bookingInfo.status
            }
            return mappedData
            
        } catch (error: any) {
            console.log(error)
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}

