import { ForwardGeocodeResult } from "../../../../domain/entities/GeocodeResult";
import { IGeocodeService } from "../../../../domain/interface/serviceInterface/IGeocodeService";
import { IForwardGeocodeUseCase } from "../../../interface/useCases/geocode/ola/IForwardGeocodeUseCase";

export class ForwardGeocodeUseCase implements IForwardGeocodeUseCase {
    constructor(
        private readonly _geocodeService: IGeocodeService
    ) { }

    async execute(address: string): Promise<ForwardGeocodeResult[]> {
        try {
            return await this._geocodeService.forwardGeocode(address);
        } catch (error: unknown) {
            throw error;
        }
    }
}
