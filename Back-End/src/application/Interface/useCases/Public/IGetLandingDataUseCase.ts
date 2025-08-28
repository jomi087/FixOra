import { GetLandingDataOutputDTO } from "../../../DTO's/LandingPageDto";

export interface IGetLandingDataUseCase {
    execute():Promise<GetLandingDataOutputDTO>
}