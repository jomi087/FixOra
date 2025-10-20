import { ProviderServiceInfoOutputDTO } from "../../../DTOs/ProviderInfoDTO";

export interface IProviderServiceInfoUseCase {
    execute(providerUserId:string):Promise<ProviderServiceInfoOutputDTO>
}