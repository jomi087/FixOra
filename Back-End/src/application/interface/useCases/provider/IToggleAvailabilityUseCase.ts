import { toggleAvailabilityInputDTO } from "../../../dto/AvailabilityDTO";

export interface IToggleAvailabilityUseCase{
    execute(input:toggleAvailabilityInputDTO):Promise<void>
}