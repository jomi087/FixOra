import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { INotificationService } from "../../../domain/interface/ServiceInterface/INotificationService";
import { IPaymentService } from "../../../domain/interface/ServiceInterface/IPaymentService";
import { BookingStatus } from "../../../shared/Enums/BookingStatus";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { PaymentMode, PaymentStatus } from "../../../shared/Enums/Payment";
import { Messages } from "../../../shared/Messages";
import { IVerifyPaymentUseCase } from "../../Interface/useCases/Client/IVerifyPaymentUseCase";


const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, BOOKING_ID_NOT_FOUND } = Messages;


export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
    constructor(
        private readonly _paymentService: IPaymentService,
        private readonly _notificationService: INotificationService,
        private readonly _bookingRepository: IBookingRepository,
    ) { }

    async execute(rawBody: Buffer, signature: string): Promise<void> {
        try {

            const result = await this._paymentService.verifyPayment(rawBody, signature);
            if (!result) return;
            const { eventType, bookingId, transactionId, reason } = result;


            if (eventType === "success") {

                const booking = await this._bookingRepository.findByBookingId(bookingId);
                if (!booking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

                const TotalAmount = booking.pricing.baseCost + booking.pricing.distanceFee;

                booking.paymentInfo = {
                    mop: PaymentMode.ONLINE,
                    status: PaymentStatus.SUCCESS,
                    paidAt: new Date(),
                    transactionId
                };

                booking.status = BookingStatus.CONFIRMED;
                booking.esCrowAmout = TotalAmount;
                booking.acknowledgment = {
                    isWorkCompletedByProvider: false,
                    isWorkConfirmedByUser: false,
                };

                const updatedBooking = await this._bookingRepository.updateBooking(bookingId, booking);
                if (!updatedBooking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

                setTimeout(() => {
                    this._notificationService.notifyPaymentSuccessToUser(booking.userId, {
                        bookingId: booking.bookingId,
                        status: booking.status
                    });
                }, 5000);

                this._notificationService.notifyBookingConfirmation(booking.providerUserId, {
                    bookingId: booking.bookingId,
                    scheduledAt: booking.scheduledAt,
                    status: booking.status,
                    acknowledgment: {
                        isWorkCompletedByProvider: booking.acknowledgment.isWorkCompletedByProvider,
                        isWorkConfirmedByUser: booking.acknowledgment.isWorkConfirmedByUser
                    }
                });
            }

            if (eventType === "failure") {

                const booking = await this._bookingRepository.findByBookingId(bookingId);
                if (!booking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

                booking.paymentInfo = {
                    mop: PaymentMode.ONLINE,
                    status: PaymentStatus.FAILED,
                    paidAt: new Date(),
                    transactionId,
                    reason: reason || "Payment failed"
                };
                booking.status = BookingStatus.CANCELLED;

                const updatedBooking = await this._bookingRepository.updateBooking(bookingId, booking);
                if (!updatedBooking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };


                setTimeout(() => {
                    this._notificationService.notifyPaymentFailureToUser(booking.userId, {
                        bookingId: booking.bookingId,
                        reason: booking.paymentInfo?.reason || "Payment failed",
                        status: booking.status,
                    });
                }, 5000);
            }

        } catch (error: any) {
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}  