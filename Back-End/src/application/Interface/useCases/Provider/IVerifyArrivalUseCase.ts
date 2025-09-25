export interface IVerifyArrivalUseCase {
  execute(bookingId: string): Promise<string>;
}
