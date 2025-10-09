import { toggleAvailabilityInputDTO } from "../../../DTOs/AvailabilityDTO";

export interface IToggleAvailabilityUseCase{
    execute(input:toggleAvailabilityInputDTO):Promise<void>
}