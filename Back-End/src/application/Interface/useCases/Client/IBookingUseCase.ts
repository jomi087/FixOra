import { BookingInputDTO, BookingOutputDTO } from "../../../DTO's/BookingDTO.js";

export interface IBookingUseCase{
    execute(input : BookingInputDTO ):Promise<BookingOutputDTO>
}