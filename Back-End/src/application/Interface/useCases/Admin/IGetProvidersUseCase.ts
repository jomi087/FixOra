import { GetProvidersInputDTO, GetProvidersOutputDTO } from "../../../DTO's/GetProviderDTO";

export interface IGetProvidersUseCase {
    execute(input : GetProvidersInputDTO):Promise<GetProvidersOutputDTO>
}