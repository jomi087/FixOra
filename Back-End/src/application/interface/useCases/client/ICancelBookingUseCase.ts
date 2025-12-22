import { CancelBookingInputDTO, CancelBookingOutputDTO } from "../../../dto/booking/BookingInfoDTO";

export interface ICancelBookingUseCase  {
    execute(input: CancelBookingInputDTO):Promise<CancelBookingOutputDTO>
}
