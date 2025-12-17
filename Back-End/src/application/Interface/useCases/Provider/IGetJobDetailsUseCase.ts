import { jobDetailsOutputDTO } from "../../../dtos/BookingDTO/BookingInfoDTO";

export interface IGetJobDetailsUseCase  {
    execute(input : string):Promise<jobDetailsOutputDTO>
}
