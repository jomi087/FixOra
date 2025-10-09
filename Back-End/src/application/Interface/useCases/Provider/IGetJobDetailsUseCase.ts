import { jobDetailsOutputDTO } from "../../../DTOs/BookingDTO/BookingInfoDTO";

export interface IGetJobDetailsUseCase  {
    execute(input : string):Promise<jobDetailsOutputDTO>
}
