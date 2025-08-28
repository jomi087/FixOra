import { Gender } from "../../shared/Enums/Gender";

export interface KYCDTO  {
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


export interface KYCInputDTO extends KYCDTO {}