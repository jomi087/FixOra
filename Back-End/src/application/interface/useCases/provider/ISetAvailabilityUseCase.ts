import { setAvailabilityInputDTO, setAvailabilityOutputDTO } from "../../../dto/AvailabilityDTO";

export interface ISetAvailabilityUseCase{
    execute(input:setAvailabilityInputDTO):Promise<setAvailabilityOutputDTO[]>
}