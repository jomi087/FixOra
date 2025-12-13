import { GetServicesInputDTO, GetServicesOutputDTO } from "../../../DTOs/CategoryDTO";

export interface IGetServiceUseCase {
    execute(input : GetServicesInputDTO ):Promise< GetServicesOutputDTO >
}

