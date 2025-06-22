/*  You can see another version Using class  */

import { RoleEnum } from "../constant/Roles.js";

export interface Address {
  houseinfo: string;
  street: string;
  district: string;
  city: string;
  locality: string;
  state: string;
  postalCode: string;
  cordinates: {
      latitude: number;
      longitude: number;
  }
}

export interface User {
  userId: string;
  fname: string;
  lname?: string;
  email: string;
  mobileNo?: string;
  password?: string;
  role: RoleEnum; // 
  refreshToken?: string;
  location?: Address ;
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}






