import { setAvailabilityInputDTO, setAvailabilityOutputDTO } from "../../../DTO's/AvailabilityDTO";

export interface ISetAvailabilityUseCase{
    execute(input:setAvailabilityInputDTO):Promise<setAvailabilityOutputDTO[]>
}