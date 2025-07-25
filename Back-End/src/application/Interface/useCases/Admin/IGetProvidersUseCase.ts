import { GetProvidersInputDTO, GetProvidersOutputDTO } from "../../../DTO's/GetProviderDTO.js";

export interface IGetProvidersUseCase {
    execute(input : GetProvidersInputDTO):Promise<GetProvidersOutputDTO>
}