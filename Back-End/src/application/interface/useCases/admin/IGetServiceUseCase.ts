import { GetServicesInputDTO, GetServicesOutputDTO } from "../../../dto/CategoryDTO";

export interface IGetServiceUseCase {
    execute(input : GetServicesInputDTO ):Promise< GetServicesOutputDTO >
}

