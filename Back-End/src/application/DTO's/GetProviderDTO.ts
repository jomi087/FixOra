import { Gender } from "../../shared/constant/Gender.js";
import { PaginationInputDTO, PaginationOutputDTO } from "./Common/PaginationDTO.js";

export interface GetProvidersInputDTO extends PaginationInputDTO {}

export interface GetProvidersOutputDTO extends PaginationOutputDTO<ProviderDTO> { }

export interface ProviderDTO {
    providerId : string
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
        Coordinates: {
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
    },
    isOnline: boolean;
}
