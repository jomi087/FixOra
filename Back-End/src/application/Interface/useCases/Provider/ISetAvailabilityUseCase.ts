import { setAvailabilityInputDTO, setAvailabilityOutputDTO } from "../../../DTOs/AvailabilityDTO";

export interface ISetAvailabilityUseCase{
    execute(input:setAvailabilityInputDTO):Promise<setAvailabilityOutputDTO[]>
}