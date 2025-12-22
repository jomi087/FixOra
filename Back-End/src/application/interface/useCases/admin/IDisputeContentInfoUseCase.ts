import { DisputeContentOutput } from "../../../dto/DisputeDTO";

export interface IDisputeContentInfoUseCase {
    execute(disputeId: string):Promise<DisputeContentOutput>
}