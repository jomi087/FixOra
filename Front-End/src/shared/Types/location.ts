export type Location = {
  latitude: number;
  longitude: number;
  formattedAddress?: string; 
}

export type Address = {
  houseinfo?: string;
  street?: string;
  district: string;
  city: string;
  locality: string;
  state: string;
  postalCode: string;
}

export type Coordinates = {
  latitude: number;
  longitude: number;
}

export type AddressWithCoordinates = Address & {
  coordinates: Coordinates;
};
  
export interface AppLocation {
  lat: number;
  lng: number;
  address: string;
}
 