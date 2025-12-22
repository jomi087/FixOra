import { RetryAvailabilityInputDTO, RetryAvailabilityOutputDTO } from "../../../dtos/booking/BookingInfoDTO";

export interface IRetryAvailabilityUseCase  {
    execute(input: RetryAvailabilityInputDTO):Promise<RetryAvailabilityOutputDTO|null>
}
