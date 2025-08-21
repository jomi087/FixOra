import { UpdateBookingStatusInputDTO, UpdateBookingStatusOutputDTO } from "../../../DTO's/BookingDTO/UpdateBookingStatusDTO.js";

export interface IUpdateBookingStatusUseCase{
    execute(input : UpdateBookingStatusInputDTO ):Promise<UpdateBookingStatusOutputDTO|null >
}