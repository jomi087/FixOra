import { RescheduleBookingInputDTO } from "../../../DTOs/BookingDTO/RescheduleBooking";

export interface IRescheduleBookingUseCase {
    execute(input: RescheduleBookingInputDTO): Promise<Date> 
}