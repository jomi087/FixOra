import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { IWalletRepository } from "../../../domain/interface/RepositoryInterface/IWalletRepository";
import { IBookingSchedulerService } from "../../../domain/interface/ServiceInterface/IBookingSchedulerService";
import { INotificationService } from "../../../domain/interface/ServiceInterface/INotificationService";
import { IPaymentService } from "../../../domain/interface/ServiceInterface/IPaymentService";
import { BookingStatus } from "../../../shared/Enums/BookingStatus";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { PaymentMode, PaymentStatus } from "../../../shared/Enums/Payment";
import { TransactionStatus, TransactionType } from "../../../shared/Enums/Transaction";
import { Messages } from "../../../shared/Messages";
import { IVerifyPaymentUseCase } from "../../Interface/useCases/Client/IVerifyPaymentUseCase";


const { INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST } = HttpStatusCode;
const { INTERNAL_ERROR, BOOKING_ID_NOT_FOUND, WALLET_ID_NOT_FOUND } = Messages;


export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
    constructor(
        private readonly _paymentService: IPaymentService,
        private readonly _notificationService: INotificationService,
        private readonly _bookingRepository: IBookingRepository,
        private readonly _walletRepository: IWalletRepository,
        private readonly _bookingSchedulerService: IBookingSchedulerService,

    ) { }

    async execute(rawBody: Buffer, signature: string): Promise<void> {
        try {

            const result = await this._paymentService.verifyPayment(rawBody, signature);
            if (!result) return;
            const { eventType, id, transactionId, amount, reason } = result;
            // console.log(transactionId,"transactionID");

            if (eventType === "booking_success") {

                const booking = await this._bookingRepository.findByBookingId(id);
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

                const updatedBooking = await this._bookingRepository.updateBooking(id, booking);
                if (!updatedBooking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

                const jobKey = `paymentBooking-${id}`;
                this._bookingSchedulerService.cancel(jobKey);

                setTimeout(() => {
                    this._notificationService.notifyPaymentSuccessToUser(booking.userId);
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

            if (eventType === "booking_failed") {

                const booking = await this._bookingRepository.findByBookingId(id);
                if (!booking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

                booking.paymentInfo = {
                    mop: PaymentMode.ONLINE,
                    status: PaymentStatus.FAILED,
                    paidAt: new Date(),
                    transactionId,
                    reason: reason || "Payment failed"
                };
                booking.status = BookingStatus.CANCELLED;

                const updatedBooking = await this._bookingRepository.updateBooking(id, booking);
                if (!updatedBooking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

                const jobKey = `paymentBooking-${id}`;
                this._bookingSchedulerService.cancel(jobKey);

                setTimeout(() => {
                    this._notificationService.notifyPaymentFailureToUser(
                        booking.userId,
                        booking.paymentInfo?.reason || "Payment failed",
                    );
                }, 5000);

            }

            if (eventType === "wallet_success") {

                const wallet = await this._walletRepository.findByUserId(id);
                if (!wallet) throw { status: NOT_FOUND, message: WALLET_ID_NOT_FOUND };
                if (!amount) throw { status: BAD_REQUEST, message: "Amount required" };

                const numAmount = Number(amount);
                await this._walletRepository.updateWalletOnTransaction({
                    userId: id,
                    transactionId,
                    amount: numAmount,
                    status: TransactionStatus.SUCCESS,
                    type: TransactionType.CREDIT,
                });
                setTimeout(() => {
                    this._notificationService.notifyPaymentSuccessToUser(id);
                }, 5000);
            }

            if (eventType === "wallet_failed") {
                const wallet = await this._walletRepository.findByUserId(id);
                if (!wallet) throw { status: NOT_FOUND, message: WALLET_ID_NOT_FOUND };

                const numAmount = Number(amount) || 0;
                await this._walletRepository.updateWalletOnTransaction({
                    userId: id,
                    transactionId,
                    amount: numAmount,
                    status: TransactionStatus.FAILED,
                    type: TransactionType.CREDIT,
                    reason: reason || "Payment failed"
                });

                setTimeout(() => {
                    this._notificationService.notifyPaymentFailureToUser(
                        id,
                        reason || "Payment failed",
                    );
                }, 5000);
            }

        } catch (error: any) {
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }


}  