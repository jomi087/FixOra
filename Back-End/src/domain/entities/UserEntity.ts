//Anemic entity (for advance version you can go with rich entiy behavioral entity also instead of interface we can use class )

import { RoleEnum } from "../../shared/enums/Roles";
export interface Address {
  houseinfo?: string;
  street?: string;
  district: string;
  city: string;
  locality: string;
  state: string;
  postalCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  }
  geo: { // this was implimented to support distance-based filtering using $geoNear,
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface SelectedLocation {
  address: string;          // formatted full address
  lat: number;
  lng: number;
  updatedAt: Date;
}

export interface User {
  userId: string;
  fname: string;
  lname?: string;
  email: string;
  mobileNo?: string;
  password?: string;
  role: RoleEnum;
  googleId?: string;
  refreshToken?: string;
  location?: Address;
  selectedLocation?: SelectedLocation;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  fcmTokens?: { token: string; platform: string; createdAt: Date }[];
}


/* You can see another version Using class  */
