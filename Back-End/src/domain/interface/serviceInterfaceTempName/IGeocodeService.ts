import { AutocompleteResult, ForwardGeocodeResult } from "../../entities/GeocodeResult";

export interface IGeocodeService {
    reverseGeocode(lat: number, lng: number): Promise<string>;

    forwardGeocode(address: string): Promise<ForwardGeocodeResult[]>;

    autocomplete(address: string): Promise<AutocompleteResult[]>;
}
