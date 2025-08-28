import { Booking } from "../../entities/BookingEntity";

export interface IPaymentService {
  createPaymentIntent(bookingId: string): Promise<string>;
  verifyPayment(rawBody: Buffer, signature: string):Promise<{ booking: Booking; eventType: string } | null >;
}