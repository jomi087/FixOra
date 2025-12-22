import { BookingDetailsOutputDTO } from "../../../dto/booking/BookingInfoDTO";

export interface IGetBookingDetailsUseCase  {
    execute(input : string):Promise<BookingDetailsOutputDTO>
}
