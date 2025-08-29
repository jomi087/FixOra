import { GetServicesInputDTO, GetServicesOutputDTO } from "../../../DTO's/GetServiceDTO";

export interface IGetServiceUseCase {
    execute(input : GetServicesInputDTO ):Promise< GetServicesOutputDTO >
}

