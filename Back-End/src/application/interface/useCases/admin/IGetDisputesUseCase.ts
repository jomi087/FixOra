import { DisputeListResponseDTO, FilterDisputeInputDTO } from "../../../dto/DisputeDTO";

export interface IGetDisputesUseCase {
    execute(input : FilterDisputeInputDTO ): Promise<DisputeListResponseDTO>
}