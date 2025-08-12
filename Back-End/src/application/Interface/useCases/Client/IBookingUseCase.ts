import { CreateBookingApplicationInputDTO, CreateBookingApplicationOutputDTO } from "../../../DTO's/BookingDTO/CreateBookingApplicationDTO .js";

export interface IBookingUseCase{
    execute(input : CreateBookingApplicationInputDTO ):Promise<CreateBookingApplicationOutputDTO>
}