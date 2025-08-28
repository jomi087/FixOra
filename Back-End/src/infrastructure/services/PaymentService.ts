import Stripe from "stripe";
import { IPaymentService } from "../../domain/interface/ServiceInterface/IPaymentService";
import { IBookingRepository } from "../../domain/interface/RepositoryInterface/IBookingRepository";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode";
import { Messages } from "../../shared/Messages";
import { BookingStatus } from "../../shared/Enums/BookingStatus";
import { PaymentMode, PaymentStatus } from "../../shared/Enums/Payment";
import { Booking } from "../../domain/entities/BookingEntity";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode
const { INTERNAL_ERROR, BOOKING_ID_NOT_FOUND } = Messages


export class PaymentService implements IPaymentService {

  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-07-30.basil" })

  constructor(
    private readonly _bookingRepository: IBookingRepository,
  ) { }

  async createPaymentIntent(bookingId: string): Promise<string> {
    try {
      let booking = await this._bookingRepository.findByBookingId(bookingId)
      if (!booking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND }

      let totalAmount = booking.pricing.baseCost + booking.pricing.distanceFee

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card',],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `Booking ${booking.bookingId}`,
              },
              unit_amount: totalAmount*100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/user/payment/${booking.bookingId}`,
        cancel_url: `${process.env.FRONTEND_URL}/user/payment/${booking.bookingId}`,
     
        metadata : {
          bookingId: booking.bookingId,
        },
      },
      {
        idempotencyKey: `booking_${bookingId}`,// Handles accidental retries, refreshes, or user double clicks. -> Prevents duplicate Stripe sessions
      })

      return session.id;

    } catch (error: any) {
      console.log(error)
      if (error.status && error.message) throw error;
      throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
    }
  }

  async verifyPayment(rawBody: Buffer, signature: string): Promise<{ booking: Booking; eventType: string } | null > {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);

      

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const bookingId = session.metadata?.bookingId;
          
          if (!bookingId) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND }

          const booking = await this._bookingRepository.findByBookingId(bookingId);
          if (!booking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

          const TotalAmount = booking.pricing.baseCost + booking.pricing.distanceFee

          booking.paymentInfo = booking.paymentInfo ?? {
            mop: PaymentMode.ONLINE,
            status: PaymentStatus.SUCCESS,
            paidAt: new Date(),
            transactionId :  session.payment_intent as string
          };

          booking.status = BookingStatus.CONFIRMED;
          booking.esCrowAmout = TotalAmount

          const updatedBooking = await this._bookingRepository.updateBooking(bookingId, booking)
          if(!updatedBooking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND }
      
          return { booking: updatedBooking, eventType: "success" };
        }

        case "checkout.session.expired": {
          const session = event.data.object as Stripe.Checkout.Session;
          const bookingId = session.metadata?.bookingId;

          if (!bookingId) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND }

          const booking = await this._bookingRepository.findByBookingId(bookingId);
          if (!booking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

          booking.paymentInfo = booking.paymentInfo ?? {
            mop: PaymentMode.ONLINE,
            status: PaymentStatus.FAILED,
            paidAt: new Date(),
            transactionId :  session.payment_intent as string,
            reason : "Checkout session expired"
          };
          booking.status = BookingStatus.CANCELLED;

          const updatedBooking = await this._bookingRepository.updateBooking(bookingId, booking)
          if(!updatedBooking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND }
          
          return { booking: updatedBooking, eventType: "failure" };
        }
          
        case "payment_intent.payment_failed": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const bookingId = paymentIntent.metadata?.bookingId;

          if (!bookingId) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND }

          const booking = await this._bookingRepository.findByBookingId(bookingId);
          if (!booking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

          booking.paymentInfo = booking.paymentInfo ?? {
            mop: PaymentMode.ONLINE,
            status: PaymentStatus.FAILED,
            paidAt: new Date(),
            transactionId :  paymentIntent.id,
            reason: paymentIntent.last_payment_error?.message || "Payment failed",
          };
          booking.status = BookingStatus.CANCELLED;
         
          const updatedBooking = await this._bookingRepository.updateBooking(bookingId, booking)
          if(!updatedBooking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND }
          
          return { booking: updatedBooking, eventType: "failure" };
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

