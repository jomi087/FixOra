import { UpdateBookingStatusInputDTO, UpdateBookingStatusOutputDTO } from "../../../dto/booking/UpdateBookingStatusDTO";

export interface IUpdateBookingStatusUseCase{
    execute(input : UpdateBookingStatusInputDTO ):Promise<UpdateBookingStatusOutputDTO|null >
}