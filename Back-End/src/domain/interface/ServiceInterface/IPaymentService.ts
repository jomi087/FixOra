

export interface IPaymentService {
  createPaymentIntent(bookingId : string): Promise<string>;

}