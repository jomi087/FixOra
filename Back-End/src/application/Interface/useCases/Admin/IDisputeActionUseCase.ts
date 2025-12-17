import { DisputeActionInputDTO, DisputeActionOutputDTO } from "../../../dtos/DisputeDTO";

export interface IDisputeActionUseCase {
    execute(input: DisputeActionInputDTO): Promise<DisputeActionOutputDTO>
}