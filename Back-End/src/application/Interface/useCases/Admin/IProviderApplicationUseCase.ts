import { ProviderApplicationInputDTO, ProviderApplicationOutputDTO } from "../../../DTO's/ProviderApplicationDTO";

export interface IProviderApplicationUseCase {
    execute(input : ProviderApplicationInputDTO):Promise<ProviderApplicationOutputDTO>
}