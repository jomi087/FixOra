import { GetActiveProvidersInputDTO, GetActiveProvidersOutputDTO } from "../../../DTOs/GetActiveProvidersDTO";

export interface IGetActiveProvidersUseCase{
    execute(input : GetActiveProvidersInputDTO ):Promise<GetActiveProvidersOutputDTO>
}