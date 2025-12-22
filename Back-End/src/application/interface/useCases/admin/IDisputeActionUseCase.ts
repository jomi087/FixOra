import { DisputeActionInputDTO, DisputeActionOutputDTO } from "../../../dto/DisputeDTO";

export interface IDisputeActionUseCase {
    execute(input: DisputeActionInputDTO): Promise<DisputeActionOutputDTO>
}