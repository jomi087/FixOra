import { ProviderBookingsInfoInputDTO, ProviderBookingsInfoOutputDTO } from "../../../DTO's/ProviderBookingsInfoDTO.js";

export interface IProviderBookingsInfoUseCase{
    execute(input: ProviderBookingsInfoInputDTO ): Promise<ProviderBookingsInfoOutputDTO>
}