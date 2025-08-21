import { Booking } from "../../../domain/entities/BookingEntity.js";
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository.js";
import { IBookingSchedulerService } from "../../../domain/interface/ServiceInterface/IBookingSchedulerService.js";
import { INotificationService } from "../../../domain/interface/ServiceInterface/INotificationService.js";
import { BookingStatus } from "../../../shared/Enums/BookingStatus.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { ProviderResponseStatus } from "../../../shared/Enums/ProviderResponse.js";
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
    
    async execute(input:UpdateBookingStatusInputDTO ): Promise<UpdateBookingStatusOutputDTO|null > {
        try {
            const { bookingId, action, reason } = input;

            const booking = await this.bookingRepository.findByBookingId(bookingId);
            if (!booking) {
                throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND  }
            }

            if (booking.provider.response !== ProviderResponseStatus.PENDING) {
                throw { status: CONFLICT, message: ALREADY_UPDATED }
            }

            let updatedBookingData: Booking | null
            
            if (action === ProviderResponseStatus.REJECTED) {
                updatedBookingData = await this.bookingRepository.updateResponseAndStatus(bookingId, BookingStatus.CANCELLED, action, reason)
            } else {
                updatedBookingData = await this.bookingRepository.updateResponse(bookingId, action)
            }

            if (!updatedBookingData) {
                throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND  }
            }

            this.notificationService.notifyBookingResponseToUser(updatedBookingData.userId, {
                bookingId: updatedBookingData.bookingId,
                response : updatedBookingData.provider.response,
                scheduledAt: updatedBookingData.scheduledAt,
                ...(action === ProviderResponseStatus.REJECTED && { reason: updatedBookingData.provider.reason })
            });

            const jobKey = `booking-${updatedBookingData.bookingId}`;
            this.bookingSchedulerService.cancel(jobKey)

            let mappedData = (action !== ProviderResponseStatus.REJECTED) ? {
                bookingId: updatedBookingData.bookingId,
                userId: updatedBookingData.userId,
                scheduledAt: updatedBookingData.scheduledAt,
                status: updatedBookingData.status,
            } : null 

            return mappedData;

        } catch (error :any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}