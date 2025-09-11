import Stripe from "stripe";
import { IPaymentService } from "../../domain/interface/ServiceInterface/IPaymentService";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode";
import { Messages } from "../../shared/Messages";
import { RoleEnum } from "../../shared/Enums/Roles";

const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;


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
                            unit_amount: totalAmount * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: `${process.env.FRONTEND_URL}/user/providers/provider-booking/payment/${bookingId}`,
                cancel_url: `${process.env.FRONTEND_URL}/user/providers/provider-booking/payment/${bookingId}`,
                metadata: {
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

    async createWalletTopUpIntent(userId: string, role: RoleEnum, amount: number): Promise<string> {
        try {
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "inr",
                            product_data: {
                                name: "Wallet Top-Up",
                            },
                            unit_amount: Math.round(amount * 100),
                        },
                        quantity: 1,
                    }
                ],
                mode: "payment",
                success_url: role === RoleEnum.Customer
                    ? `${process.env.FRONTEND_URL}/user/account/wallet`
                    : `${process.env.FRONTEND_URL}/provider/wallet`,

                cancel_url: role === RoleEnum.Provider
                    ? `${process.env.FRONTEND_URL}/user/account/wallet`
                    : `${process.env.FRONTEND_URL}/provider/wallet`,
                metadata: {
                    userId,
                    amount
                }
            });
            return session.id;

        } catch (error: any) {
            console.log(error);
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }

    async verifyPayment(rawBody: Buffer, signature: string): Promise<{ eventType: string, id: string, transactionId: string, amount?: string, reason?: string } | null> {
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
        let event: Stripe.Event;
        try {
            event = this.stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);


            switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                const transactionId = session.payment_intent
                    ? (session.payment_intent as string) : "N/A";

                if (session.metadata?.bookingId) {
                    return {
                        eventType: "booking_success",
                        id: session.metadata.bookingId,
                        transactionId,
                    };
                } else if (session.metadata?.userId) {
                    return {
                        eventType: "wallet_success",
                        id: session.metadata.userId,
                        transactionId,
                        amount: session.metadata.amount,
                    };
                }
                return null;
            }

            case "checkout.session.expired": {
                const session = event.data.object as Stripe.Checkout.Session;

                const transactionId = session.payment_intent
                    ? (session.payment_intent as string) : "N/A";

                if (session.metadata?.bookingId) {
                    return {
                        eventType: "booking_failed",
                        id: session.metadata.bookingId,
                        transactionId,
                        reason: "Checkout session expired"
                    };
                } else if (session.metadata?.userId) {
                    return {
                        eventType: "wallet_failed",
                        id: session.metadata.userId,
                        transactionId,
                        amount: session.metadata.amount,
                        reason: "Checkout session expired"
                    };
                }
                return null;
            }

            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const transactionId = paymentIntent.id;

                if (paymentIntent.metadata?.bookingId) {
                    return {
                        eventType: "booking_failed",
                        id: paymentIntent.metadata?.bookingId,
                        transactionId,
                        reason: paymentIntent.last_payment_error?.message || "Payment failed",
                    };
                } else if (paymentIntent.metadata?.userId) {
                    return {
                        eventType: "wallet_failed",
                        id: paymentIntent.metadata.userId,
                        transactionId,
                        amount: paymentIntent.metadata.amount,
                        reason: paymentIntent.last_payment_error?.message || "Payment failed",
                    };
                }
                return null;
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

