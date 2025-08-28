import { INotificationService } from "../../../domain/interface/ServiceInterface/INotificationService";
import { IPaymentService } from "../../../domain/interface/ServiceInterface/IPaymentService";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/Messages";
import { IVerifyPaymentUseCase } from "../../Interface/useCases/Client/IVerifyPaymentUseCase";

const { INTERNAL_SERVER_ERROR} = HttpStatusCode
const { INTERNAL_ERROR } = Messages


export class VerifyPaymentUseCase implements IVerifyPaymentUseCase{
    constructor(
        private readonly _paymentService: IPaymentService ,
        private readonly _notificationService: INotificationService,
    ) { }
    
    async execute(rawBody: Buffer, signature: string): Promise<void> {
        try {
            const result = await this._paymentService.verifyPayment(rawBody, signature)
            console.log(result,"check result")
            
            if (!result) return;
            
            const { booking, eventType } = result;

            if (eventType === "success") {
                setTimeout(() => {
                    this._notificationService.notifyPaymentSuccessToUser(booking.userId, {
                        bookingId: booking.bookingId,
                        status: booking.status
                    })
                },5000)
            }

            if (eventType === "failure") {
               setTimeout(() => {
                    this._notificationService.notifyPaymentFailureToUser(booking.userId, {
                        bookingId: booking.bookingId,
                        reason: booking.paymentInfo?.reason|| "Payment failed",
                        status: booking.status,
                    })
                },5000)
            }
            
        } catch (error: any) {
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}