import { RescheduleBookingInputDTO } from "../../../dto/booking/RescheduleBooking";

export interface IRescheduleBookingUseCase {
    execute(input: RescheduleBookingInputDTO): Promise<Date> 
}