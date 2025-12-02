import { ForwardGeocodeResult } from "../../../../domain/entities/GeocodeResult";
import { IGeocodeService } from "../../../../domain/interface/ServiceInterface/IGeocodeService";
import { IForwardGeocodeUseCase } from "../../../Interface/useCases/geocode/ola/IForwardGeocodeUseCase";
import { Messages } from "../../../../shared/const/Messages";
import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";

const { INTERNAL_SERVER_ERROR, } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class ForwardGeocodeUseCase implements IForwardGeocodeUseCase {
    constructor(
        private readonly _geocodeService: IGeocodeService
    ) { }

    async execute(address: string): Promise<ForwardGeocodeResult[]> {
        try {
            return await this._geocodeService.forwardGeocode(address);
        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}
