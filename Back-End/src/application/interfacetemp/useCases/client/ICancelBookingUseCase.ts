import { CancelBookingInputDTO, CancelBookingOutputDTO } from "../../../dtos/BookingDTO/BookingInfoDTO";

export interface ICancelBookingUseCase  {
    execute(input: CancelBookingInputDTO):Promise<CancelBookingOutputDTO>
}
