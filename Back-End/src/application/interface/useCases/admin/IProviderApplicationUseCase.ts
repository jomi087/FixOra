import { ProviderApplicationInputDTO, ProviderApplicationOutputDTO } from "../../../dto/ProviderApplicationDTO";

export interface IProviderApplicationUseCase {
    execute(input : ProviderApplicationInputDTO):Promise<ProviderApplicationOutputDTO>
}