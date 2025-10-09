import { GetLandingDataOutputDTO } from "../../../DTOs/LandingPageDto";

export interface IGetLandingDataUseCase {
    execute():Promise<GetLandingDataOutputDTO>
}