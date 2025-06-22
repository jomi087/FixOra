import { KYCStatus } from "../constant/KYCstatus.js";

export interface Provider {
  userId: string;
  gender?: "Male" | "Female" | "Other";
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
  createdAt?: Date;
  updatedAt?: Date;
}

