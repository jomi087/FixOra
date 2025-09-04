import { ConfirmBookingOutputDTO } from "../../../DTO's/BookingDTO/BookingInfoDTO";

export interface IGetConfirmBookingsUseCase {
    execute(input : string ):Promise<ConfirmBookingOutputDTO[]>
}
