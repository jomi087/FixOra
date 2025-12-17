import { ProviderApplicationInputDTO, ProviderApplicationOutputDTO } from "../../../dtos/ProviderApplicationDTO";

export interface IProviderApplicationUseCase {
    execute(input : ProviderApplicationInputDTO):Promise<ProviderApplicationOutputDTO>
}