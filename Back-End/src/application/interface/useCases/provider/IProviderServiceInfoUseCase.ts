import { ProviderServiceInfoOutputDTO } from "../../../dto/ProviderInfoDTO";

export interface IProviderServiceInfoUseCase {
    execute(providerUserId:string):Promise<ProviderServiceInfoOutputDTO>
}