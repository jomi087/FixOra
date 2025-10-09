import { GetProvidersInputDTO, GetProvidersOutputDTO } from "../../../DTOs/GetProviderDTO";

export interface IGetProvidersUseCase {
    execute(input : GetProvidersInputDTO):Promise<GetProvidersOutputDTO>
}