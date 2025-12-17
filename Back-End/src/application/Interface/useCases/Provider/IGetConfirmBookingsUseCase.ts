import { ConfirmBookingOutputDTO } from "../../../dtos/BookingDTO/BookingInfoDTO";

export interface IGetConfirmBookingsUseCase {
    execute(input : string ):Promise<ConfirmBookingOutputDTO[]>
}
