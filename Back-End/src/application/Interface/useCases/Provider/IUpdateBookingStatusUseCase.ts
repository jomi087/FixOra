import { UpdateBookingStatusInputDTO, UpdateBookingStatusOutputDTO } from "../../../DTOs/BookingDTO/UpdateBookingStatusDTO";

export interface IUpdateBookingStatusUseCase{
    execute(input : UpdateBookingStatusInputDTO ):Promise<UpdateBookingStatusOutputDTO|null >
}