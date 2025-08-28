import { UpdateBookingStatusInputDTO, UpdateBookingStatusOutputDTO } from "../../../DTO's/BookingDTO/UpdateBookingStatusDTO";

export interface IUpdateBookingStatusUseCase{
    execute(input : UpdateBookingStatusInputDTO ):Promise<UpdateBookingStatusOutputDTO|null >
}