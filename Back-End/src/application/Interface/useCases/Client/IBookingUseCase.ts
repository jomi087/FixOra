import { CreateBookingApplicationInputDTO, CreateBookingApplicationOutputDTO } from "../../../DTO's/BookingDTO/CreateBookingApplicationDTO";

export interface IBookingUseCase{
    execute(input : CreateBookingApplicationInputDTO ):Promise<CreateBookingApplicationOutputDTO>
}