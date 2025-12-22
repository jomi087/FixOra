import { IBookingRepository } from "../../../domain/interface/repositoryInterface/IBookingRepository";
import { BookingStatus } from "../../../shared/enums/BookingStatus";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { PaymentStatus } from "../../../shared/enums/Payment";
import { Messages } from "../../../shared/const/Messages";
import { RetryAvailabilityInputDTO, RetryAvailabilityOutputDTO } from "../../dtos/booking/BookingInfoDTO";
import { IRetryAvailabilityUseCase } from "../../interface/useCases/client/IRetryAvailabilityUseCase";
import { AppError } from "../../../shared/errors/AppError";


const { NOT_FOUND, BAD_REQUEST } = HttpStatusCode;
const { DATA_MISMATCH, ALREDY_BOOKED, NOT_FOUND_MSG, SLOT_TIME_PASSED } = Messages;

export class RetryAvailabilityUseCase implements IRetryAvailabilityUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,

    ) { }

    async execute(input: RetryAvailabilityInputDTO): Promise<RetryAvailabilityOutputDTO | null> {
        try {

            const { userId, bookingId } = input;

            const bookingData = await this._bookingRepository.findByBookingId(bookingId);
            if (!bookingData) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));
            };

            if (bookingData.userId !== userId) throw new AppError(BAD_REQUEST, DATA_MISMATCH);


            //valdiationg if slot is availabe or not 
            const currentDateTime = new Date();
            const scheduledDateTime: Date = bookingData.scheduledAt;

            if (scheduledDateTime < currentDateTime) {
                const cancelledAt = new Date();

                // Cancel booking since the scheduled time has passed
                const cancelledBooking = await this._bookingRepository.updatePaymentAndStatus(
                    bookingId,
                    BookingStatus.CANCELLED,
                    PaymentStatus.FAILED,
                    SLOT_TIME_PASSED,
                    cancelledAt
                );

                if (!cancelledBooking?.paymentInfo) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));

                return {
                    status: cancelledBooking.status,
                    paymentInfo: {
                        status: cancelledBooking.paymentInfo.status,
                        reason: cancelledBooking.paymentInfo.reason || SLOT_TIME_PASSED
                    },
                    reason: SLOT_TIME_PASSED,
                };

            }

            let existingBooking = await this._bookingRepository.findExistingBooking(bookingData.provider.id, bookingData.scheduledAt);

            if (existingBooking) {
                const cancelledAt = new Date();

                // Cancel this booking since slot is taken
                let cancelledBooking = await this._bookingRepository.updatePaymentAndStatus(
                    bookingId,
                    BookingStatus.CANCELLED,
                    PaymentStatus.FAILED,
                    ALREDY_BOOKED,
                    cancelledAt
                );

                if (!cancelledBooking?.paymentInfo) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));

                return {
                    status: cancelledBooking.status,
                    paymentInfo: {
                        status: cancelledBooking.paymentInfo.status,
                        reason: cancelledBooking.paymentInfo.reason || ALREDY_BOOKED,
                    },
                    reason: ALREDY_BOOKED,
                };
            }
            return null;

        } catch (error: unknown) {
            throw error;
        }
    }
}
