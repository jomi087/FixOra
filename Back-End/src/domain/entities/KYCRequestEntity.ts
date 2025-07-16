import { Gender } from "../../shared/constant/Gender.js";
import { KYCStatus } from "../../shared/constant/KYCstatus.js";

export interface KYCRequest {
    userId: string;
    dob: Date;
    gender: Gender;
    serviceId: string;
    specializationIds: string[];
    profileImage: string;
    serviceCharge: number;
    kyc : {
        idCard: string;
        certificate: {
            education: string;
            experience?: string;
        };
    };
    status: KYCStatus;
    reason?: string;
    submittedAt: Date;
    reviewedAt?: Date;
    reviewedBy?: string;
}