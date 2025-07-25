import { GetLandingDataOutputDTO } from "../../../DTO's/LandingPageDto.js";

export interface IGetLandingDataUseCase {
    execute():Promise<GetLandingDataOutputDTO>
}