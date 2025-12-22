import { PendingBookingRequestOutputDTO } from "../../../dtos/booking/PendingBookingRequestDTO";

export interface IPendingBookingRequestUseCase {
    execute(providerUserId : string ):Promise<PendingBookingRequestOutputDTO[]>
}
