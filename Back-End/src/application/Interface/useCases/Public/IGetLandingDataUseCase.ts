import { GetLandingDataOutputDTO } from "../../../dtos/LandingPageDto";

export interface IGetLandingDataUseCase {
    execute():Promise<GetLandingDataOutputDTO>
}