import { RetryAvailabilityInputDTO, RetryAvailabilityOutputDTO } from "../../../dtos/BookingDTO/BookingInfoDTO";

export interface IRetryAvailabilityUseCase  {
    execute(input: RetryAvailabilityInputDTO):Promise<RetryAvailabilityOutputDTO|null>
}
