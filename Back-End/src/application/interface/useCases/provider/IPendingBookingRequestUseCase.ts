import { PendingBookingRequestOutputDTO } from "../../../dto/booking/PendingBookingRequestDTO";

export interface IPendingBookingRequestUseCase {
    execute(providerUserId : string ):Promise<PendingBookingRequestOutputDTO[]>
}
