import { CreateBookingApplicationInputDTO, CreateBookingApplicationOutputDTO } from "../../../dtos/BookingDTO/CreateBookingApplicationDTO";

export interface IBookingUseCase{
    execute(input : CreateBookingApplicationInputDTO ):Promise<CreateBookingApplicationOutputDTO>
}