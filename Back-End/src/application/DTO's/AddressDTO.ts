export interface AddressDTO{
    houseinfo?: string;
    street?: string;
    district: string;
    city: string;
    locality: string;
    state : string;
    postalCode: string;
    coordinates: {
        latitude: number;
        longitude: number;
    }
    geo?:{ // this was implimented to support distance-based filtering using $geoNear,
        type: "Point";
        coordinates: [number, number]; // [longitude, latitude]
    };
}
 