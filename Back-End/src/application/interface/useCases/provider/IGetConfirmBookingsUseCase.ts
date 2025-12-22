import { ConfirmBookingOutputDTO } from "../../../dtos/booking/BookingInfoDTO";

export interface IGetConfirmBookingsUseCase {
    execute(input : string ):Promise<ConfirmBookingOutputDTO[]>
}
