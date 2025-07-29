import type { Gender } from "../enums/Gender";
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

export type ActiveProviderDTO = {
  providerId : string
  user: {
    userId: string,
    fname: string;
    lname: string;
    mobileNo: string;
    location: {
      houseinfo?: string;
      street?: string;
      district: string;
      city: string;
      locality: string;
      state: string;
      postalCode: string;
      coordinates: {
        latitude: number;
        longitude: number
      };
    };
  };
  gender: Gender;
  service: {
    categoryId: string
    name: string;
    subcategories: {
        subCategoryId: string;
        name: string
    }[];
  };
  profileImage: string;
  serviceCharge: number;
  isOnline: boolean;
  averageRating: number;
  totalRatings: number;
}


//Admin 
//userManagement
export interface CustomersData extends User {
  userId: string;
  role: RoleEnum;
  isBlocked: boolean;
  location?: AddressWithCoordinates;
}

//providerManagement
export interface ProviderData  {
  providerId : string
  user: {
    userId: string,
    fname: string;
    lname: string;
    email: string;
    mobileNo: string;
    isBlocked: boolean;
    location: {
      houseinfo?: string;
      street?: string;
      district: string;
      city: string;
      locality: string;
      state: string;
      postalCode: string;
      coordinates: {
          latitude: number;
          longitude: number
      };
    };
  };
  dob: Date;
  gender: Gender;
  service: {
    categoryId: string
    name: string;
    subcategories: {
        subCategoryId: string;
        name: string
    }[];
  };
  profileImage: string;
  serviceCharge: number;
  kyc : {
    idCard: string;
    certificate: {
        education: string;
        experience?: string;
    };
  },
  isOnline: boolean;
}

//providerKYCApplicationList
export interface ProviderList {
  id: string;
  user: {
    userId: string
    fname: string;
    lname: string;
    email: string;
    mobileNo: string;
    location: {
        houseinfo?: string;
        street?: string;
        district: string;
        city: string;
        locality: string;
        state: string;
        postalCode: string;
        coordinates:{
            latitude: number;
            longitude: number;
        } 
    }
  };
  dob: string;
  gender: string;
  service: {
        categoryId: string
        name: string;
        subcategories: {
            subCategoryId: string;
            name: string
        }[];
    };
  profileImage: string;
  serviceCharge: number;
  kyc: {
    idCard: string;
    certificate: {
      education: string;
      experience?: string;
    };
  };
  status: string;
  reason?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

