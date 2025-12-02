import axios from "axios";
import { IGeocodeService } from "../../domain/interface/ServiceInterface/IGeocodeService";
import { AutocompleteResult, ForwardGeocodeResult } from "../../domain/entities/GeocodeResult";

export class OlaGeocodeService implements IGeocodeService {
    private readonly API_KEY = process.env.OLA_API_KEY;

    // 1. Reverse geocode (latlng → address)
    async reverseGeocode(lat: number, lng: number): Promise<string> {
        const url = "https://api.olamaps.io/places/v1/reverse-geocode";

        const res = await axios.get(url, {
            params: {
                latlng: `${lat},${lng}`,   
                api_key: this.API_KEY,
            },
        });

        return res.data?.results?.[0]?.formatted_address || "";
    }

    // 2. Forward geocode (address → lat/lng)
    async forwardGeocode(address: string): Promise<ForwardGeocodeResult[]> {
        const url = "https://api.olamaps.io/places/v1/geocode";

        const res = await axios.get(url, {
            params: {
                address: address,      
                api_key: this.API_KEY,
            },
        });
        return (
            res.data?.geocodingResults?.map((r:any) => ({
                lat: r.geometry.location.lat,
                lng: r.geometry.location.lng,
                address: r.formatted_address,
            })) || []
        );
    }

    // 3. Autocomplete
    async autocomplete(address: string): Promise<AutocompleteResult[]> {
        const url = "https://api.olamaps.io/places/v1/autocomplete";

        const res = await axios.get(url, {
            params: {
                input: address,
                api_key: this.API_KEY,
            },
        });

        return (
            res.data?.predictions?.map((p: any) => ({
                description: p.description,
            })) || []
        );
    }
}
