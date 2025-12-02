import { AutocompleteResult } from "../../../../domain/entities/GeocodeResult";
import { IGeocodeService } from "../../../../domain/interface/ServiceInterface/IGeocodeService";
import { IAutocompleteGeocodeUseCase } from "../../../Interface/useCases/geocode/ola/IAutocompleteGeocodeUseCase";
import { Messages } from "../../../../shared/const/Messages";
import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";

const { INTERNAL_SERVER_ERROR, } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class AutocompleteGeocodeUseCase implements IAutocompleteGeocodeUseCase {
    constructor(
        private readonly _geocodeService: IGeocodeService
    ) { }

    async execute(address: string): Promise<AutocompleteResult[]> {
        try {
            return await this._geocodeService.autocomplete(address);
        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}
