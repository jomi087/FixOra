import { ProviderServiceInfoOutputDTO, ProviderServiceInfoInputDTO } from "../../../dtos/ProviderInfoDTO";

export interface IProviderDataUpdateUseCase {
    execute(input:ProviderServiceInfoInputDTO):Promise<ProviderServiceInfoOutputDTO>
}