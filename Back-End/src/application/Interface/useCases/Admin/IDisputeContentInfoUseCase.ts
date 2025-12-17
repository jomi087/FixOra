import { DisputeContentOutput } from "../../../dtos/DisputeDTO";

export interface IDisputeContentInfoUseCase {
    execute(disputeId: string):Promise<DisputeContentOutput>
}