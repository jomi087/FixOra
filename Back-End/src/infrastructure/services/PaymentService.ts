import Stripe from "stripe";
import { IPaymentService } from "../../domain/interface/ServiceInterface/IPaymentService";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode";
import { Messages } from "../../shared/Messages";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, BOOKING_ID_NOT_FOUND } = Messages;


export class PaymentService implements IPaymentService {

    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-07-30.basil" });

    constructor(
    ) { }

    async createPaymentIntent(bookingId: string, totalAmount: number): Promise<string> {
        try {

            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ["card",],
                line_items: [
                    {
                        price_data: {
                            currency: "inr",
                            product_data: {
                                name: `Booking ${bookingId}`,
                            },
                            unit_amount: totalAmount*100,
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: `${process.env.FRONTEND_URL}/user/payment/${bookingId}`,
                cancel_url: `${process.env.FRONTEND_URL}/user/payment/${bookingId}`,
     
                metadata : {
                    bookingId: bookingId,
                },
            },
            {
                idempotencyKey: `booking_${bookingId}`,// Handles accidental retries, refreshes, or user double clicks. -> Prevents duplicate Stripe sessions
            });

            return session.id;

        } catch (error: any) {
            console.log(error);
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }

    async verifyPayment(rawBody: Buffer, signature: string): Promise<{eventType: string, bookingId: string, transactionId: string, reason?: string   } | null > {
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
        let event: Stripe.Event;
        try {
            event = this.stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);

      
            switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                    
                const bookingId = session.metadata?.bookingId;
                if (!bookingId) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };
                    
                return {
                    eventType: "success",
                    bookingId,
                    transactionId: session.payment_intent as string,
                };
            }

            case "checkout.session.expired": {
                const session = event.data.object as Stripe.Checkout.Session;
                
                const bookingId = session.metadata?.bookingId;
                if (!bookingId) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };
                
                return {
                    eventType: "success",
                    bookingId,
                    transactionId: session.payment_intent as string,
                    reason : "Checkout session expired"
                };
               
            }
          
            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                
                const bookingId = paymentIntent.metadata?.bookingId;
                if (!bookingId) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };
                
                return {
                    eventType: "success",
                    bookingId,
                    transactionId :  paymentIntent.id,
                    reason: paymentIntent.last_payment_error?.message || "Payment failed",
                };
                
            } 
          
            default:
                return null;
            }
        } catch (error: any) {
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    
    }
}

