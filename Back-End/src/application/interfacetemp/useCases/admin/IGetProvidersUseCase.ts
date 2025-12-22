import { GetProvidersInputDTO, GetProvidersOutputDTO } from "../../../dtos/GetProviderDTO";

export interface IGetProvidersUseCase {
    execute(input : GetProvidersInputDTO):Promise<GetProvidersOutputDTO>
}