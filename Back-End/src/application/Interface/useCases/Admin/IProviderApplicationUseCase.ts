import { ProviderApplicationInputDTO, ProviderApplicationOutputDTO } from "../../../DTOs/ProviderApplicationDTO";

export interface IProviderApplicationUseCase {
    execute(input : ProviderApplicationInputDTO):Promise<ProviderApplicationOutputDTO>
}