import { RetryAvailabilityInputDTO, RetryAvailabilityOutputDTO } from "../../../DTOs/BookingDTO/BookingInfoDTO";

export interface IRetryAvailabilityUseCase  {
    execute(input: RetryAvailabilityInputDTO):Promise<RetryAvailabilityOutputDTO|null>
}
