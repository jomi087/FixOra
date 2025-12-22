import { DisputeListResponseDTO, FilterDisputeInputDTO } from "../../../dtos/DisputeDTO";

export interface IGetDisputesUseCase {
    execute(input : FilterDisputeInputDTO ): Promise<DisputeListResponseDTO>
}