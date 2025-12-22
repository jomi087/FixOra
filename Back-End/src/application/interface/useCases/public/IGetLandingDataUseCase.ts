import { GetLandingDataOutputDTO } from "../../../dto/LandingPageDto";

export interface IGetLandingDataUseCase {
    execute():Promise<GetLandingDataOutputDTO>
}