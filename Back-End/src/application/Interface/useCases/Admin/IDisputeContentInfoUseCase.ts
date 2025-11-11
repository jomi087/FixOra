import { DisputeContentOutput } from "../../../DTOs/DisputeDTO";

export interface IDisputeContentInfoUseCase {
    execute(disputeId: string):Promise<DisputeContentOutput>
}