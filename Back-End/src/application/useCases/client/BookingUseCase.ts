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

const { INTERNAL_SERVER_ERROR,CONFLICT,NOT_FOUND} = HttpStatusCode
const { INTERNAL_ERROR,ALREDY_BOOKED,PENDING_BOOKING,NOT_FOUND_MSG,BOOKING_ID_NOT_FOUND,PROVIDER_NO_RESPONSE } = Messages

export class BookingUseCase implements IBookingUseCase {
    constructor(
        private readonly bookingRepository: IBookingRepository,
        private readonly notificationService: INotificationService,
        private readonly bookingSchedulerService: IBookingSchedulerService
    ) { }
    
    async execute(input: CreateBookingApplicationInputDTO): Promise<CreateBookingApplicationOutputDTO> {
        try {

            let CheckExistingNoRejectedBooking = await this.bookingRepository.findExistingBooking(input.providerId, input.time, input.fullDate)
           // console.log(CheckExistingNoRejectedBooking)
            if (CheckExistingNoRejectedBooking && (CheckExistingNoRejectedBooking.status == BookingStatus.ACCEPTED)) {
                throw { status: CONFLICT, message: ALREDY_BOOKED }
            } else if (CheckExistingNoRejectedBooking && (CheckExistingNoRejectedBooking.status == BookingStatus.PENDING)) {
                throw { status: CONFLICT, message: PENDING_BOOKING }
            }

            const newBooking: Booking = {
                bookingId: uuidv4(),
                ...input,
                status: BookingStatus.PENDING
            }

            let bookingId = await this.bookingRepository.create(newBooking)
            const bookingDataInDetails = await this.bookingRepository.findCurrentBookingDetails(bookingId)

            if (!bookingDataInDetails) {
                throw { status: NOT_FOUND, message: NOT_FOUND_MSG };
            }

            const { user, provider, booking, subCategory } = bookingDataInDetails

            const mappedData: CreateBookingApplicationOutputDTO = {
                user: {
                    userId: user.userId,
                    fname: user.fname,
                    lname: user.lname,
                },
                provider: {
                    providerId: booking.providerId,
                    providerUserId: provider.userId,
                    fname: provider.fname,
                    lname: provider.lname,
                },
                issueType: {
                    issueTypeId: subCategory.subCategoryId,
                    name: subCategory.name,
                },
                bookings: {
                    bookingId: booking.bookingId,
                    fullDate: booking.fullDate,
                    time: booking.time,
                    status: booking.status
                }
            }

            let id = mappedData.provider.providerUserId

            this.notificationService.notifyBookingRequestToProvider(id, {
                bookingId: booking.bookingId,
                userName: `${mappedData.user.fname} ${mappedData.user.lname}`,
                issueType: `${mappedData.issueType.name}`,
                fullDate: booking.fullDate,
                time: booking.time,
                issue: booking.issue
            })

            const jobKey = `booking-${booking.bookingId}`;

            this.bookingSchedulerService.scheduleAutoReject(jobKey, booking.bookingId, BOOKING_REQUEST_TIMEOUT_MS, async () => {
                const currentBooking = await this.bookingRepository.findByBookingId(booking.bookingId);
                
                if (!currentBooking || currentBooking.status !== BookingStatus.PENDING) return

                let updatedBookingData = await this.bookingRepository.updateStatus(booking.bookingId, {
                    status: BookingStatus.REJECTED,
                    reason: PROVIDER_NO_RESPONSE,
                })

                if (!updatedBookingData) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND }
                
 
                this.notificationService.notifyBookingResponseToUser(updatedBookingData.userId, {
                    bookingId: updatedBookingData.bookingId,
                    status: updatedBookingData.status,
                    fullDate: updatedBookingData.fullDate,
                    time: updatedBookingData.time,
                    reason: updatedBookingData.reason as string
                });

                this.notificationService.notifyBookingAutoRejectToProvider(updatedBookingData.providerUserId, {
                    bookingId: updatedBookingData.bookingId,
                    status: updatedBookingData.status,
                    reason: updatedBookingData.reason as string
                });
            })

            return mappedData
            
        } catch (error: any) {
            console.log(error)
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}

