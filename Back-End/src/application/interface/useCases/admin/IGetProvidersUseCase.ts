import { GetProvidersInputDTO, GetProvidersOutputDTO } from "../../../dto/GetProviderDTO";

export interface IGetProvidersUseCase {
    execute(input : GetProvidersInputDTO):Promise<GetProvidersOutputDTO>
}