import { Booking } from "../../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { IBookingSchedulerService } from "../../../domain/interface/ServiceInterface/IBookingSchedulerService";
import { INotificationService } from "../../../domain/interface/ServiceInterface/INotificationService";
import { PAYMENT_SESSION_TIMEOUT } from "../../../shared/const/constants";
import { BookingStatus } from "../../../shared/Enums/BookingStatus";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { PaymentStatus } from "../../../shared/Enums/Payment";
import { ProviderResponseStatus } from "../../../shared/Enums/ProviderResponse";
import { Messages } from "../../../shared/const/Messages";
import { UpdateBookingStatusInputDTO, UpdateBookingStatusOutputDTO } from "../../DTO's/BookingDTO/UpdateBookingStatusDTO";
import { IUpdateBookingStatusUseCase } from "../../Interface/useCases/Provider/IUpdateBookingStatusUseCase";


const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT } = HttpStatusCode;
const { INTERNAL_ERROR, BOOKING_ID_NOT_FOUND, ALREADY_UPDATED, PAYMENT_TIMEOUT_MSG } = Messages;

export class UpdateBookingStatusUseCase implements IUpdateBookingStatusUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _notificationService: INotificationService,
        private readonly _bookingSchedulerService: IBookingSchedulerService,
    ) { }

    private schedulePaymentTimeout(bookingId: string): void {
        const paymentKey = `paymentBooking-${bookingId}`;

        this._bookingSchedulerService.scheduleTimeoutJob(paymentKey, bookingId, PAYMENT_SESSION_TIMEOUT, async () => {
            const latestBooking = await this._bookingRepository.findByBookingId(bookingId);
            // console.log(latestBooking?.paymentInfo?.status);

            if (!latestBooking || latestBooking.paymentInfo?.status !== PaymentStatus.PENDING) return;

            const cancelledAt = new Date();
            let cancelledBookingData = await this._bookingRepository.updatePaymentAndStatus(
                bookingId,
                BookingStatus.CANCELLED,
                PaymentStatus.PENDING,
                PAYMENT_TIMEOUT_MSG,
                cancelledAt
            );

            if (!cancelledBookingData) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };
            this._notificationService.autoRejectTimeOutPayment(cancelledBookingData.userId, cancelledBookingData.bookingId);
        });
    }

    async execute(input: UpdateBookingStatusInputDTO): Promise<UpdateBookingStatusOutputDTO | null> {
        try {
            const { bookingId, action, reason } = input;

            const booking = await this._bookingRepository.findByBookingId(bookingId);
            if (!booking) {
                throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };
            }

            if (booking.provider.response !== ProviderResponseStatus.PENDING) {
                throw { status: CONFLICT, message: ALREADY_UPDATED };
            }

            let updatedBookingData: Booking | null;

            if (action === ProviderResponseStatus.REJECTED) {
                const cancelledAt = new Date();
                updatedBookingData = await this._bookingRepository.updateProviderResponseAndStatus(bookingId, BookingStatus.CANCELLED, action, reason, cancelledAt);
            } else {
                updatedBookingData = await this._bookingRepository.updateProviderResponseAndPaymentStatus(bookingId, action, PaymentStatus.PENDING);
            }

            if (!updatedBookingData) {
                throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };
            }

            if (action === ProviderResponseStatus.ACCEPTED) {
                this.schedulePaymentTimeout(updatedBookingData.bookingId);
            }

            this._notificationService.notifyBookingResponseToUser(updatedBookingData.userId, {
                bookingId: updatedBookingData.bookingId,
                response: updatedBookingData.provider.response,
                scheduledAt: updatedBookingData.scheduledAt,
                ...(action === ProviderResponseStatus.REJECTED && { reason: updatedBookingData.provider.reason })
            });


            const jobKey = `providerResponse-${updatedBookingData.bookingId}`;
            this._bookingSchedulerService.cancel(jobKey);

            let mappedData = (action !== ProviderResponseStatus.REJECTED) ? {
                bookingId: updatedBookingData.bookingId,
                userId: updatedBookingData.userId,
                scheduledAt: updatedBookingData.scheduledAt,
                status: updatedBookingData.status,
            } : null;

            return mappedData;

        } catch (error: any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}