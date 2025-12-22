import { GetActiveProvidersInputDTO, GetActiveProvidersOutputDTO } from "../../../dtos/GetActiveProvidersDTO";

export interface IGetActiveProvidersUseCase{
    execute(input : GetActiveProvidersInputDTO ):Promise<GetActiveProvidersOutputDTO>
}