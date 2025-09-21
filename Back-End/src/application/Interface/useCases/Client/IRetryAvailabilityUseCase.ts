import { RetryAvailabilityInputDTO, RetryAvailabilityOutputDTO } from "../../../DTO's/BookingDTO/BookingInfoDTO";

export interface IRetryAvailabilityUseCase  {
    execute(input: RetryAvailabilityInputDTO):Promise<RetryAvailabilityOutputDTO|null>
}
