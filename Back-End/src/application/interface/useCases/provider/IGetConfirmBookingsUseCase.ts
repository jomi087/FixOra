import { ConfirmBookingOutputDTO } from "../../../dto/booking/BookingInfoDTO";

export interface IGetConfirmBookingsUseCase {
    execute(input : string ):Promise<ConfirmBookingOutputDTO[]>
}
