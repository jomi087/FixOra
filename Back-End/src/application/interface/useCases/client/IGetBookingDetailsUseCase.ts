import { BookingDetailsOutputDTO } from "../../../dtos/booking/BookingInfoDTO";

export interface IGetBookingDetailsUseCase  {
    execute(input : string):Promise<BookingDetailsOutputDTO>
}
