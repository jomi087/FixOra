import { ProviderApplicationInputDTO, ProviderApplicationOutputDTO } from "../../../DTO's/ProviderApplicationDTO.js";

export interface IProviderApplicationUseCase {
    execute(input : ProviderApplicationInputDTO):Promise<ProviderApplicationOutputDTO>
}