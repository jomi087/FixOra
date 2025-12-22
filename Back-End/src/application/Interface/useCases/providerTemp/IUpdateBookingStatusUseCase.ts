import { UpdateBookingStatusInputDTO, UpdateBookingStatusOutputDTO } from "../../../dtos/BookingDTO/UpdateBookingStatusDTO";

export interface IUpdateBookingStatusUseCase{
    execute(input : UpdateBookingStatusInputDTO ):Promise<UpdateBookingStatusOutputDTO|null >
}