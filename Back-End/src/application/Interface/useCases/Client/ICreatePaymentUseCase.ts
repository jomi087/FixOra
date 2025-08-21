
export interface ICreatePaymentUseCase{

    execute(bookingId : string):Promise<string>
}