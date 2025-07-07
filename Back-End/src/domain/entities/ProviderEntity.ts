import { KYCStatus } from "../../shared/constant/KYCstatus.js";

export interface Provider {
  userId: string;
  serviceIds: string[];
  gender: "Male" | "Female" | "Other";
  image: string;
  kyc: {
    idCard: string; 
    certificate: {
      education: string; 
      experience?: string; 
    };
  };
  serviceCharge: number;
  kycInfo: {
    status: KYCStatus;
    reason?: string;
  };
  isOnline: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}