import { toggleAvailabilityInputDTO } from "../../../dtos/AvailabilityDTO";

export interface IToggleAvailabilityUseCase{
    execute(input:toggleAvailabilityInputDTO):Promise<void>
}