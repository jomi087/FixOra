import { AutocompleteResult } from "../../../../../domain/entities/GeocodeResult";

export interface IAutocompleteGeocodeUseCase {
    execute(address: string): Promise<AutocompleteResult[]>
}
