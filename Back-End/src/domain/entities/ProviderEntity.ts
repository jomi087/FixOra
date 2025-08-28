import { Gender } from "../../shared/Enums/Gender";

export interface Provider {
  providerId: string;
  userId: string;
  dob: Date;
  gender: Gender;
  serviceId: string;
  specializationIds: string[]; // subcategoriesa
  profileImage: string;
  serviceCharge: number;
  kyc: {
    idCard: string; 
    certificate: {
      education: string; 
      experience?: string; 
    };
  };
  isOnline: boolean;
  createdAt?: Date;    
  updatedAt?: Date;      
}

export interface ProviderWithDetails {
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
  averageRating?: number;  
  totalRatings?: number; 
}
