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
// import { SendBookingCancelledNotificationUseCase } from "../Notificiations/SendBookingCancelledNotificationUseCase";
import { SendBookingConfirmedNotificationUseCase } from "../Notificiations/SendBookingConfirmedNotificationUseCase";


const { INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST } = HttpStatusCode;
const { INTERNAL_ERROR, BOOKING_ID_NOT_FOUND, WALLET_ID_NOT_FOUND } = Messages;


export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
    constructor(
        private readonly _paymentService: IPaymentService,
        private readonly _notificationService: INotificationService,
        private readonly _bookingRepository: IBookingRepository,
        private readonly _walletRepository: IWalletRepository,
        private readonly _bookingSchedulerService: IBookingSchedulerService,
        private readonly _sendBookingConfirmedNotificationUseCase: SendBookingConfirmedNotificationUseCase,
        // private readonly _sendBookingCancelledNotificationUseCase: SendBookingCancelledNotificationUseCase    
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

                const totalAmount = booking.pricing.baseCost + booking.pricing.distanceFee;
                const updateData = {
                    paymentInfo: {
                        mop: PaymentMode.ONLINE,
                        status: PaymentStatus.SUCCESS,
                        paidAt: new Date(),
                        transactionId,
                    },
                    status: BookingStatus.CONFIRMED,
                    esCrowAmout: totalAmount,
                    acknowledgment: {
                        isWorkCompletedByProvider: false,
                        isWorkConfirmedByUser: false,
                    },
                };

                //pending: instead of updtedBooking get the Booking data with userName and providerName 
                const updatedBooking = await this._bookingRepository.updateBooking(id, updateData);
                if (!updatedBooking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

                const jobKey = `paymentBooking-${id}`;
                this._bookingSchedulerService.cancel(jobKey);

                //user
                // setTimeout(() => {
                //     this._notificationService.//notifyPaymentSuccessToUser(booking.userId);
                // }, 5000);

                //provider
                // this._notificationService.//notifyBookingConfirmation(booking.providerUserId, {
                //     bookingId: updatedBooking.bookingId,
                //     scheduledAt: updatedBooking.scheduledAt,
                //     status: updatedBooking.status,
                //     acknowledgment: {
                //         isWorkCompletedByProvider: updatedBooking.acknowledgment?.isWorkCompletedByProvider || false,
                //         isWorkConfirmedByUser: updatedBooking.acknowledgment?.isWorkConfirmedByUser || false
                //     }
                // });

                //to user
                setTimeout(async () => {
                    await this._sendBookingConfirmedNotificationUseCase.execute({
                        userId: updatedBooking.userId,
                        title: "Booking Confirmed",
                        message: `Your booking has been confirmed for ${updatedBooking.scheduledAt.toLocaleString()}.`,
                        metadata: {
                            bookingId: updatedBooking.bookingId,
                        }
                    });
                }, 5000);

                //to provider
                await this._sendBookingConfirmedNotificationUseCase.execute({
                    userId: updatedBooking.providerUserId,
                    title: "New Booking",
                    message: "You have a new booking",
                    metadata: {
                        bookingId: updatedBooking.bookingId,
                        scheduledAt: updatedBooking.scheduledAt,
                        status: updatedBooking.status,
                        acknowledgment: {
                            isWorkCompletedByProvider: updatedBooking.acknowledgment?.isWorkCompletedByProvider || false,
                            isWorkConfirmedByUser: updatedBooking.acknowledgment?.isWorkConfirmedByUser || false
                        }
                    }
                }); 
            }

            if (eventType === "booking_failed") {

                const booking = await this._bookingRepository.findByBookingId(id);
                if (!booking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

                const updateData = {
                    paymentInfo: {
                        mop: PaymentMode.ONLINE,
                        status: PaymentStatus.FAILED,
                        paidAt: new Date(),
                        transactionId,
                        reason: reason || "Payment failed"
                    },
                    status: BookingStatus.CANCELLED,
                    cancelledAt: new Date()
                };

                const updatedBooking = await this._bookingRepository.updateBooking(id, updateData);
                if (!updatedBooking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

                const jobKey = `paymentBooking-${id}`;
                this._bookingSchedulerService.cancel(jobKey);

                // setTimeout(() => {
                //     this._notificationService.//notifyPaymentFailureToUser(
                //         updatedBooking.userId,
                //         updatedBooking.paymentInfo?.reason || "Payment failed",
                //     );
                // }, 5000);
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