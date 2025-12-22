import { ProviderServiceInfoOutputDTO } from "../../../dtos/ProviderInfoDTO";

export interface IProviderServiceInfoUseCase {
    execute(providerUserId:string):Promise<ProviderServiceInfoOutputDTO>
}