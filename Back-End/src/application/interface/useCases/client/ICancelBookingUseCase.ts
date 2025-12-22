import { CancelBookingInputDTO, CancelBookingOutputDTO } from "../../../dtos/booking/BookingInfoDTO";

export interface ICancelBookingUseCase  {
    execute(input: CancelBookingInputDTO):Promise<CancelBookingOutputDTO>
}
