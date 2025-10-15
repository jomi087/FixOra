import { PendingBookingRequestOutputDTO } from "../../../DTOs/BookingDTO/PendingBookingRequestDTO";

export interface IPendingBookingRequestUseCase {
    execute(providerUserId : string ):Promise<PendingBookingRequestOutputDTO[]>
}
