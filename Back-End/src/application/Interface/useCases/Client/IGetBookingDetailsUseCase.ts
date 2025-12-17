import { BookingDetailsOutputDTO } from "../../../dtos/BookingDTO/BookingInfoDTO";

export interface IGetBookingDetailsUseCase  {
    execute(input : string):Promise<BookingDetailsOutputDTO>
}
