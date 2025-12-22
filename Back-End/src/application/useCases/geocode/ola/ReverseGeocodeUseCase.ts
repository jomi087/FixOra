import { IGeocodeService } from "../../../../domain/interface/serviceInterface/IGeocodeService";
import { IReverseGeocodeUseCase } from "../../../Interface/useCases/geocode/ola/IReverseGeocodeUseCase";


export class ReverseGeocodeUseCase implements IReverseGeocodeUseCase {
    constructor(
        private readonly _geocodeService: IGeocodeService
    ) { }

    async execute(lat: number, lng: number): Promise<string> {
        try {
            return await this._geocodeService.reverseGeocode(lat, lng);
        } catch (error: unknown) {
            throw error;
        }
    }
}
