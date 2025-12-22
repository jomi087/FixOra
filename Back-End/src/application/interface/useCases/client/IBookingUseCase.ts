import { CreateBookingApplicationInputDTO, CreateBookingApplicationOutputDTO } from "../../../dto/booking/CreateBookingApplicationDTO";

export interface IBookingUseCase{
    execute(input : CreateBookingApplicationInputDTO ):Promise<CreateBookingApplicationOutputDTO>
}