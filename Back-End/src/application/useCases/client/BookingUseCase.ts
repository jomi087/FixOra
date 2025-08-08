import { Booking } from "../../../domain/entities/BookingEntity.js";
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository.js";
import { Messages } from "../../../shared/Messages.js";
import { BookingStatus } from "../../../shared/Enums/BookingStatus.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { BookingInputDTO, BookingOutputDTO } from "../../DTO's/BookingDTO.js";
import { IBookingUseCase } from "../../Interface/useCases/Client/IBookingUseCase.js";
import { v4 as uuidv4 } from "uuid";
import { INotificationService } from "../../../domain/interface/ServiceInterface/INotificationService.js";

const { INTERNAL_SERVER_ERROR,} = HttpStatusCode
const { INTERNAL_ERROR } = Messages

export class BookingUseCase implements IBookingUseCase{
    constructor(
        private readonly bookingRepository: IBookingRepository,
        private readonly notificationService : INotificationService
    ) { }
    
    async execute(input: BookingInputDTO): Promise<BookingOutputDTO> {
        try {
            const newBooking: Booking = {
                bookingId : uuidv4(),
                ...input,
                status: BookingStatus.PENDING
            }
            
            let bookingId = await this.bookingRepository.create(newBooking)
            let {user,provider, booking,subCategory}  = await this.bookingRepository.findCurrentBookingDetails(bookingId)

            const mappedData: BookingOutputDTO = {
                bookingId: booking.bookingId,
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
                    name : subCategory.name,
                },
                fullDate: booking.fullDate,
                time: booking.time,
                issue: booking.issue,
            }

            let id = mappedData.provider.providerUserId

            this.notificationService.notifyBookingRequestToProvider(id, {
                bookingId: booking.bookingId,
                userName: `${mappedData.user.fname} ${mappedData.user.lname}`,
                issueType : `${mappedData.issueType.name}`,
                fullDate: booking.fullDate,
                time: booking.time,
                issue: booking.issue
            })

            return mappedData

        } catch (error: any) {
            console.log(error)
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }

    }
}