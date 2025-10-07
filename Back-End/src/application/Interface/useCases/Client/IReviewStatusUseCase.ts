export interface IReviewStatusUseCase  {
    execute(bookingId:string):Promise<boolean>
}