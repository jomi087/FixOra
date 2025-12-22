import { ProviderServiceInfoOutputDTO, ProviderServiceInfoInputDTO } from "../../../dto/ProviderInfoDTO";

export interface IProviderDataUpdateUseCase {
    execute(input:ProviderServiceInfoInputDTO):Promise<ProviderServiceInfoOutputDTO>
}