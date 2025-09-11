import { RoleEnum } from "../../../shared/Enums/Roles";

export interface IPaymentService {
  createPaymentIntent(bookingId: string, totalAmount: number): Promise<string>;
  createWalletTopUpIntent(userId: string, role: RoleEnum, amount: number): Promise<string>;
  verifyPayment(rawBody: Buffer, signature: string): Promise<{ eventType: string, id: string, transactionId: string, amount?:string, reason?: string } | null>;
}