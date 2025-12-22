export interface IVerifyPaymentUseCase {
  execute(rawBody : Buffer, signature: string): Promise<void> ;
}