import { CreateBookingApplicationInputDTO, CreateBookingApplicationOutputDTO } from "../../../dtos/booking/CreateBookingApplicationDTO";

export interface IBookingUseCase{
    execute(input : CreateBookingApplicationInputDTO ):Promise<CreateBookingApplicationOutputDTO>
}