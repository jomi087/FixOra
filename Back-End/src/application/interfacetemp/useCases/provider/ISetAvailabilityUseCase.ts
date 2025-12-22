import { setAvailabilityInputDTO, setAvailabilityOutputDTO } from "../../../dtos/AvailabilityDTO";

export interface ISetAvailabilityUseCase{
    execute(input:setAvailabilityInputDTO):Promise<setAvailabilityOutputDTO[]>
}