import { GetActiveProvidersInputDTO, GetActiveProvidersOutputDTO } from "../../../DTO's/GetActiveProvidersDTO";

export interface IGetActiveProvidersUseCase{
    execute(input : GetActiveProvidersInputDTO ):Promise<GetActiveProvidersOutputDTO>
}