import { CancelBookingInputDTO, CancelBookingOutputDTO } from "../../../DTO's/BookingDTO/BookingInfoDTO";

export interface ICancelBookingUseCase  {
    execute(input: CancelBookingInputDTO):Promise<CancelBookingOutputDTO>
}
