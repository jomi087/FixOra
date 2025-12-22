import { UpdateBookingStatusInputDTO, UpdateBookingStatusOutputDTO } from "../../../dtos/booking/UpdateBookingStatusDTO";

export interface IUpdateBookingStatusUseCase{
    execute(input : UpdateBookingStatusInputDTO ):Promise<UpdateBookingStatusOutputDTO|null >
}