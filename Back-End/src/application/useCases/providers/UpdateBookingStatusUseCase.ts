import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository.js";
import { IBookingSchedulerService } from "../../../domain/interface/ServiceInterface/IBookingSchedulerService.js";
import { INotificationService } from "../../../domain/interface/ServiceInterface/INotificationService.js";
import { BookingStatus } from "../../../shared/Enums/BookingStatus.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";
import { UpdateBookingStatusInputDTO, UpdateBookingStatusOutputDTO } from "../../DTO's/BookingDTO/UpdateBookingStatusDTO.js";
import { IUpdateBookingStatusUseCase } from "../../Interface/useCases/Provider/IUpdateBookingStatusUseCase.js";


const { INTERNAL_SERVER_ERROR,NOT_FOUND,CONFLICT} = HttpStatusCode
const { INTERNAL_ERROR,BOOKING_ID_NOT_FOUND,ALREADY_UPDATED,} = Messages

export class UpdateBookingStatusUseCase implements IUpdateBookingStatusUseCase{
    constructor(
        private readonly bookingRepository: IBookingRepository,
        private readonly notificationService: INotificationService,
        private readonly bookingSchedulerService: IBookingSchedulerService
        
    ) { }
    
    async execute(input:UpdateBookingStatusInputDTO ): Promise<UpdateBookingStatusOutputDTO > {
        try {
            const { bookingId, status, reason } = input;

            const booking = await this.bookingRepository.findByBookingId(bookingId);
            if (!booking) {
                throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND  }
            }

            if (booking.status !== BookingStatus.PENDING) {
                throw { status: CONFLICT, message: ALREADY_UPDATED }
            }

            const updateData = (status === BookingStatus.REJECTED) ? { status: status, reason: reason } : { status : status }

            let updatedBookingData = await this.bookingRepository.updateStatus(bookingId, updateData )
            if (!updatedBookingData) {
                throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND  }
            }

            this.notificationService.notifyBookingResponseToUser(updatedBookingData.userId, {
                bookingId: updatedBookingData.bookingId,
                status: updatedBookingData.status,
                fullDate: updatedBookingData.fullDate,
                time : updatedBookingData.time,
                ...(status === BookingStatus.REJECTED && { reason: updatedBookingData.reason })
            });

            let mappedData:UpdateBookingStatusOutputDTO  = {
                bookingId: updatedBookingData.bookingId, //uuid
                userId: updatedBookingData.userId,
                fullDate: updatedBookingData.fullDate,
                time: updatedBookingData.time,
                status: updatedBookingData.status,
                ...(status === BookingStatus.REJECTED && { reason: updatedBookingData.reason })
            }
            
            const jobKey = `booking-${updatedBookingData.bookingId}`;
            this.bookingSchedulerService.cancel(jobKey)

            return mappedData

        } catch (error :any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}