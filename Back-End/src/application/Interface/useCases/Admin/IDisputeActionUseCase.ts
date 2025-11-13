import { DisputeActionInputDTO, DisputeActionOutputDTO } from "../../../DTOs/DisputeDTO";

export interface IDisputeActionUseCase {
    execute(input: DisputeActionInputDTO): Promise<DisputeActionOutputDTO>
}