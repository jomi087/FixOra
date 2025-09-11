import { AddressDTO } from "./Common/AddressDTO";
import { PaginationInputDTO, PaginationOutputDTO } from "./Common/PaginationDTO";

export interface ProviderApplicationInputDTO extends PaginationInputDTO { }

export interface ProviderApplicationOutputDTO extends PaginationOutputDTO<ProviderApplicationDTO> { }

export interface ProviderApplicationDTO {
    id: string; 
    user: {
        userId: string, 
        fname: string;
        lname: string;
        email: string;
        mobileNo: string;
        location?: AddressDTO
    };
    dob: Date;
    gender: string;
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
    kyc: {
        idCard: string;
        certificate: {
            education: string;
            experience?: string;
        };
    };
    status: string;
    submittedAt: Date;
    reason?: string;
    reviewedAt?: Date;
    reviewedBy?: string;
}

