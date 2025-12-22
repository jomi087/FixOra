import { Gender } from "../../shared/enumss/Gender";

export interface KYCFile {
    fieldName: string;
    originalName: string;
    buffer: Buffer;
}

export interface KYCDTO {
    userId: string;
    name: string;
    dob: string; // string from frontend (convert to Date in use case)
    gender: Gender;
    serviceId: string;
    specializationIds: string[];
    serviceCharge: number;
    files: Record<string, KYCFile[]>; // e.g. { profileImage: [..], idCard: [..] }
}


export interface KYCInputDTO extends KYCDTO { }
