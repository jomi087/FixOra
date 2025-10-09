import { ConfirmBookingOutputDTO } from "../../../DTOs/BookingDTO/BookingInfoDTO";

export interface IGetConfirmBookingsUseCase {
    execute(input : string ):Promise<ConfirmBookingOutputDTO[]>
}
