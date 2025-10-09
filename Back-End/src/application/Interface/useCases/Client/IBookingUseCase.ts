import { CreateBookingApplicationInputDTO, CreateBookingApplicationOutputDTO } from "../../../DTOs/BookingDTO/CreateBookingApplicationDTO";

export interface IBookingUseCase{
    execute(input : CreateBookingApplicationInputDTO ):Promise<CreateBookingApplicationOutputDTO>
}