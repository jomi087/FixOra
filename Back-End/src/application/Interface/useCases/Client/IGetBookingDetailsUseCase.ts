import { BookingDetailsOutputDTO } from "../../../DTOs/BookingDTO/BookingInfoDTO";

export interface IGetBookingDetailsUseCase  {
    execute(input : string):Promise<BookingDetailsOutputDTO>
}
