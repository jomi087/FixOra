import { RoleEnum } from "../../shared/constant/Roles.js";

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


export interface CustomerListItemDTO  {
  userId: string;
  fname: string;
  lname: string;
  email: string;
  mobileNo: string;
  role: RoleEnum;
  location: Address;
  isBlocked: boolean;
}
