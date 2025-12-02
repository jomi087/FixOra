import { IGeocodeService } from "../../../../domain/interface/ServiceInterface/IGeocodeService";
import { Messages } from "../../../../shared/const/Messages";
import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";
import { IReverseGeocodeUseCase } from "../../../Interface/useCases/geocode/ola/IReverseGeocodeUseCase";

const { INTERNAL_SERVER_ERROR, } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class ReverseGeocodeUseCase implements IReverseGeocodeUseCase {
    constructor(
        private readonly _geocodeService: IGeocodeService
    ) { }

    async execute(lat: number, lng: number): Promise<string> {
        try {
            return await this._geocodeService.reverseGeocode(lat, lng);
        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}
