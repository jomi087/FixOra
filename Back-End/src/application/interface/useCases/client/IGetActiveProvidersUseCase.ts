import { GetActiveProvidersInputDTO, GetActiveProvidersOutputDTO } from "../../../dto/GetActiveProvidersDTO";

export interface IGetActiveProvidersUseCase{
    execute(input : GetActiveProvidersInputDTO ):Promise<GetActiveProvidersOutputDTO>
}