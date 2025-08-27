import { Booking } from "../../../domain/entities/BookingEntity.js";
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository.js";
import { IBookingSchedulerService } from "../../../domain/interface/ServiceInterface/IBookingSchedulerService.js";
import { INotificationService } from "../../../domain/interface/ServiceInterface/INotificationService.js";
import { BookingStatus } from "../../../shared/Enums/BookingStatus.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { PaymentStatus } from "../../../shared/Enums/Payment.js";
import { ProviderResponseStatus } from "../../../shared/Enums/ProviderResponse.js";
import { Messages } from "../../../shared/Messages.js";
import { UpdateBookingStatusInputDTO, UpdateBookingStatusOutputDTO } from "../../DTO's/BookingDTO/UpdateBookingStatusDTO.js";
import { IUpdateBookingStatusUseCase } from "../../Interface/useCases/Provider/IUpdateBookingStatusUseCase.js";


const { INTERNAL_SERVER_ERROR,NOT_FOUND,CONFLICT} = HttpStatusCode
const { INTERNAL_ERROR,BOOKING_ID_NOT_FOUND,ALREADY_UPDATED,PAYMENT_TIMEOUT} = Messages

export class UpdateBookingStatusUseCase implements IUpdateBookingStatusUseCase{
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _notificationService: INotificationService,
        private readonly _bookingSchedulerService: IBookingSchedulerService,
    ) { }

    // private schedulePaymentTimeout(bookingId:string): void{
    //     const paymentKey = `paymentBooking-${bookingId}`

    //     this._bookingSchedulerService.scheduleTimeoutJob(paymentKey, bookingId, PAYMENT_TIMEOUT_MS, async () => {
    //         const latestBooking = await this._bookingRepository.findByBookingId(bookingId);
    //         console.log(latestBooking?.paymentInfo?.status)

    //         if (!latestBooking || latestBooking.paymentInfo?.status !== PaymentStatus.PENDING) return

    //         let cancelledBookingData  =  await this._bookingRepository.updatePaymentTimeoutAndStatus(
    //             bookingId,
    //             BookingStatus.CANCELLED,
    //             PaymentStatus.FAILED,
    //             PAYMENT_TIMEOUT,
    //         )

    //         if (!cancelledBookingData) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND }
            
    //         this._notificationService.notifyPaymentFailed(cancelledBookingData.userId, {
    //             bookingId: cancelledBookingData.bookingId,
    //             reason: cancelledBookingData.paymentInfo?.reason as string
    //         });
    //     })
    // }
    
    async execute(input:UpdateBookingStatusInputDTO ): Promise<UpdateBookingStatusOutputDTO|null > {
        try {
            const { bookingId, action, reason } = input;

            const booking = await this._bookingRepository.findByBookingId(bookingId);
            if (!booking) {
                throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND  }
            }

            if (booking.provider.response !== ProviderResponseStatus.PENDING) {
                throw { status: CONFLICT, message: ALREADY_UPDATED }
            }

            let updatedBookingData: Booking | null
            
            if (action === ProviderResponseStatus.REJECTED) {
                updatedBookingData = await this._bookingRepository.updateProviderResponseAndStatus(bookingId, BookingStatus.CANCELLED, action, reason)
            } else {
                updatedBookingData = await this._bookingRepository.updateProviderResponseAndPaymentStatus(bookingId, action,PaymentStatus.PENDING)
            }

            if (!updatedBookingData) {
                throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND  }
            }

            this._notificationService.notifyBookingResponseToUser(updatedBookingData.userId, {
                bookingId: updatedBookingData.bookingId,
                response : updatedBookingData.provider.response,
                scheduledAt: updatedBookingData.scheduledAt,
                ...(action === ProviderResponseStatus.REJECTED && { reason: updatedBookingData.provider.reason })
            });

            // if (action === ProviderResponseStatus.ACCEPTED) {
            //     this.schedulePaymentTimeout(updatedBookingData.bookingId)
            // }

            const jobKey = `providerResponse-${updatedBookingData.bookingId}`;
            this._bookingSchedulerService.cancel(jobKey)

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