import { toggleAvailabilityInputDTO } from "../../../DTO's/AvailabilityDTO";

export interface IToggleAvailabilityUseCase{
    execute(input:toggleAvailabilityInputDTO):Promise<void>
}