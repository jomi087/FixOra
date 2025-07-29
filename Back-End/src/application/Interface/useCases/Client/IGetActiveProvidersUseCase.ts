import { GetActiveProvidersInputDTO, GetActiveProvidersOutputDTO } from "../../../DTO's/GetActiveProvidersDTO.js";

export interface IGetActiveProvidersUseCase{
    execute(input : GetActiveProvidersInputDTO ):Promise<GetActiveProvidersOutputDTO>
}