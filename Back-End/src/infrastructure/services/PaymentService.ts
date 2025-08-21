import Stripe from "stripe";
import { IPaymentService } from "../../domain/interface/ServiceInterface/IPaymentService.js";
import { IBookingRepository } from "../../domain/interface/RepositoryInterface/IBookingRepository.js";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../shared/Messages.js";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode
const { INTERNAL_ERROR, BOOKING_ID_NOT_FOUND } = Messages


export class PaymentService implements IPaymentService {

  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-07-30.basil" })

  constructor(
    private readonly bookingRepository: IBookingRepository,
  ) { }

  async createPaymentIntent(bookingId: string): Promise<string> {
    try {
      let booking = await this.bookingRepository.findByBookingId(bookingId)
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
        success_url: `${process.env.FRONTEND_URL}/user/provider/booking/${booking.provider.id}`,
        cancel_url: `${process.env.FRONTEND_URL}/user/provider/booking/${booking.provider.id}`,
      })

      return session.id;

    } catch (error: any) {
      console.log(error)
      if (error.status && error.message) throw error;
      throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
    }
  }
}

