import { GetServicesInputDTO, GetServicesOutputDTO } from "../../../DTOs/GetServiceDTO";

export interface IGetServiceUseCase {
    execute(input : GetServicesInputDTO ):Promise< GetServicesOutputDTO >
}

