import type { Gender } from "../enums/Gender";
import type { KYCStatus } from "../enums/KycStatus";
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
  location: AddressWithCoordinates;
};


export type Provider = User & {
  userId: string;
  location: AddressWithCoordinates;
  role: RoleEnum;
  image: string;
  isOnline: boolean;
  gender: Gender;
  serviceCharge: number;
}


// export type ProviderImage = {
//   image: string;
// }

export interface BaseUserData extends User {
  userId: string;
  role: RoleEnum;
  isBlocked: boolean;
  location?: AddressWithCoordinates;
}

export interface CustomersData extends BaseUserData {}


export interface ProviderData extends BaseUserData {
  image: string;
  isOnline: boolean;
  gender: Gender;
  serviceCharge: number;
  kyc: {
    idCard: string;
    certificate: {
      education: string;
      experience?: string;
    };
  };
  kycInfo: {
    status: KYCStatus;
    reason?: string;
  };
}
