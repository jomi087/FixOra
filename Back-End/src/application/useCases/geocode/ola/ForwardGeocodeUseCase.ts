import { ForwardGeocodeResult } from "../../../../domain/entities/GeocodeResult";
import { IGeocodeService } from "../../../../domain/interface/serviceInterfaceTempName/IGeocodeService";
import { IForwardGeocodeUseCase } from "../../../Interface/useCases/geocode/ola/IForwardGeocodeUseCase";

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
