import { jobDetailsOutputDTO } from "../../../DTO's/BookingDTO/BookingInfoDTO";

export interface IGetJobDetailsUseCase  {
    execute(input : string):Promise<jobDetailsOutputDTO>
}
