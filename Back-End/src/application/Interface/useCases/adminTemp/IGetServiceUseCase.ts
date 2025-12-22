import { GetServicesInputDTO, GetServicesOutputDTO } from "../../../dtos/CategoryDTO";

export interface IGetServiceUseCase {
    execute(input : GetServicesInputDTO ):Promise< GetServicesOutputDTO >
}

