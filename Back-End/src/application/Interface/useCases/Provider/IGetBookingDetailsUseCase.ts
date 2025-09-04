import { BookingDetailsOutputDTO } from "../../../DTO's/BookingDTO/BookingInfoDTO";

export interface IGetBookingDetailsUseCase  {
    execute(input : string):Promise<BookingDetailsOutputDTO>
}
