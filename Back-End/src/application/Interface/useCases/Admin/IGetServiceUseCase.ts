import { GetCustomersInputDTO, GetCustomersOutputDTO } from "../../../DTO's/GetCustomerDTO.js";
import { GetServicesInputDTO, GetServicesOutputDTO } from "../../../DTO's/GetServiceDTO.js";

export interface IGetServiceUseCase {
    execute(input : GetServicesInputDTO ):Promise< GetServicesOutputDTO >
}

