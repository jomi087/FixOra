import { Gender } from "../../shared/constant/Gender.js";

export interface Provider {
  userId: string;
  dob: Date;
  gender: Gender;
  serviceId: string;
  specializationIds: string[]; // subcategories
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