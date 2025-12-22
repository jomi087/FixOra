import { RetryAvailabilityInputDTO, RetryAvailabilityOutputDTO } from "../../../dto/booking/BookingInfoDTO";

export interface IRetryAvailabilityUseCase  {
    execute(input: RetryAvailabilityInputDTO):Promise<RetryAvailabilityOutputDTO|null>
}
