import { jobDetailsOutputDTO } from "../../../dto/booking/BookingInfoDTO";

export interface IGetJobDetailsUseCase  {
    execute(input : string):Promise<jobDetailsOutputDTO>
}
