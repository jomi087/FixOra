
export interface IPaymentService {
  createPaymentIntent(bookingId: string, totalAmount: number): Promise<string>;
  verifyPayment(rawBody: Buffer, signature: string):Promise<{ eventType: string, bookingId: string, transactionId: string, reason?: string } | null >;
}