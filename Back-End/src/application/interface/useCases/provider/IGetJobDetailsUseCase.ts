import { jobDetailsOutputDTO } from "../../../dtos/booking/BookingInfoDTO";

export interface IGetJobDetailsUseCase  {
    execute(input : string):Promise<jobDetailsOutputDTO>
}
