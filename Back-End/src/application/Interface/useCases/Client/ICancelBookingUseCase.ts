import { CancelBookingInputDTO, CancelBookingOutputDTO } from "../../../DTOs/BookingDTO/BookingInfoDTO";

export interface ICancelBookingUseCase  {
    execute(input: CancelBookingInputDTO):Promise<CancelBookingOutputDTO>
}
