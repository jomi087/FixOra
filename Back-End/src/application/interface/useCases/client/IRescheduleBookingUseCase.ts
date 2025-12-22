import { RescheduleBookingInputDTO } from "../../../dtos/booking/RescheduleBooking";

export interface IRescheduleBookingUseCase {
    execute(input: RescheduleBookingInputDTO): Promise<Date> 
}