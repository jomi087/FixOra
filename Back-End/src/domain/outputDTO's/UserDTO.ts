import { RoleEnum } from "../../shared/Enums/Roles.js";

export interface Address {
  houseinfo: string;
  street: string;
  district: string;
  city: string;
  locality: string;
  state: string;
  postalCode: string;
  coordinates: {
      latitude: number;
      longitude: number;
  }
}

export interface UserDTO {
  userId: string;
  fname: string;
  lname?: string;
  email: string;
  mobileNo?: string;
  password?: string;
  role: RoleEnum;
  googleId?: string;
  refreshToken?: string;
  location?: Address ;
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
