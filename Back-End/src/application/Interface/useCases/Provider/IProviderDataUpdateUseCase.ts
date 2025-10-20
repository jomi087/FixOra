import { ProviderServiceInfoOutputDTO, ProviderServiceInfoInputDTO } from "../../../DTOs/ProviderInfoDTO";

export interface IProviderDataUpdateUseCase {
    execute(input:ProviderServiceInfoInputDTO):Promise<ProviderServiceInfoOutputDTO>
}