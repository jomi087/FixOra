import { Gender } from "../../shared/constant/Gender.js";

export interface KYCInputDTO  {
    userId: string;
    dob: string; // string from frontend (convert to Date in use case)
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
}
