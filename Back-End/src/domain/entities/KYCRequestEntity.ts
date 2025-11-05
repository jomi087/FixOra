import { Gender } from "../../shared/enums/Gender";
import { KYCStatus } from "../../shared/enums/KYCstatus";

export interface KYCRequest {
    userId: string;
    dob: Date;
    gender: Gender;
    serviceId: string;
    specializationIds: string[]; //subcategory id
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