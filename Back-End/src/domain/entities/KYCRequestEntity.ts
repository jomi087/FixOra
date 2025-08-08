import { Gender } from "../../shared/Enums/Gender.js";
import { KYCStatus } from "../../shared/Enums/KYCstatus.js";

export interface KYCRequest {
    userId: string;
    dob: Date;
    gender: Gender;
    serviceId: string;
    specializationIds: string[]; //subvategory id
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


export interface KYCRequestWithDetails {
    id: string;
    user: {
        userId: string,
        fname: string;
        lname: string;
        email: string;
        mobileNo: string;
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
    }
    status: KYCStatus;
    reason?: string
    submittedAt: Date;
    reviewedAt?: Date;
    reviewedBy?: string
}