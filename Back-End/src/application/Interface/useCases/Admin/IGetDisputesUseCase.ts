import { DisputeListResponseDTO, FilterDisputeInputDTO } from "../../../DTOs/DisputeDTO";

export interface IGetDisputesUseCase {
    execute(input : FilterDisputeInputDTO ): Promise<DisputeListResponseDTO>
}