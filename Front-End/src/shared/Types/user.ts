import type { KYCStatus } from "../enums/kycStatus";
import type { RoleEnum } from "../enums/roles";
import type { AddressWithCoordinates } from "./location";

export type Credentials = {
    email: string;
    password: string;
};

export type User = {
    fname: string;
    lname: string;
    email: string;
    mobileNo: string;
};

export type Signup = User & {
    password: string;
    cPassword: string;
};

export type Signin = Credentials & {
    role: RoleEnum;
};

export type ProfileEdit = {
    fname: string;
    lname: string;
    mobile: string;
    location: AddressWithCoordinates
}


export interface BaseUserData extends User  {
  role: string;
  isBlocked: boolean;
  location?: AddressWithCoordinates;
}

export interface CustromersData extends BaseUserData {}

export interface ProviderData extends BaseUserData {
    image: string;
    isOnline: boolean;
    gender: "Male" | "Female" | "Other";
    kyc: {
        idCard: string; 
        certificate: {
        education: string; 
        experience?: string; 
        };
    };
    serviceCharge: number;
    kycInfo: {
        status: KYCStatus ;
        reason?: string;
    }; 
}