import { PendingBookingRequestOutputDTO } from "../../../dtos/BookingDTO/PendingBookingRequestDTO";

export interface IPendingBookingRequestUseCase {
    execute(providerUserId : string ):Promise<PendingBookingRequestOutputDTO[]>
}
