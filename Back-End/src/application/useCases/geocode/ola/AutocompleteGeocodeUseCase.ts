import { AutocompleteResult } from "../../../../domain/entities/GeocodeResult";
import { IGeocodeService } from "../../../../domain/interface/ServiceInterface/IGeocodeService";
import { IAutocompleteGeocodeUseCase } from "../../../Interface/useCases/geocode/ola/IAutocompleteGeocodeUseCase";



export class AutocompleteGeocodeUseCase implements IAutocompleteGeocodeUseCase {
    constructor(
        private readonly _geocodeService: IGeocodeService
    ) { }

    async execute(address: string): Promise<AutocompleteResult[]> {
        try {
            return await this._geocodeService.autocomplete(address);
        } catch (error: unknown) {
            throw error;
        }
    }
}
