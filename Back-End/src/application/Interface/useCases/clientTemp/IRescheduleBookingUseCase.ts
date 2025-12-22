import { RescheduleBookingInputDTO } from "../../../dtos/BookingDTO/RescheduleBooking";

export interface IRescheduleBookingUseCase {
    execute(input: RescheduleBookingInputDTO): Promise<Date> 
}