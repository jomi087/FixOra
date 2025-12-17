import { Gender } from "../../shared/enums/Gender";

export interface Provider {
  providerId: string;
  userId: string;
  dob: Date;
  gender: Gender;
  serviceId: string;
  specializationIds: string[];
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
};