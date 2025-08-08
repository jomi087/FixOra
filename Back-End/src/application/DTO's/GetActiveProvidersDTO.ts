import { Gender } from "../../shared/Enums/Gender.js";
import { PaginationInputDTO, PaginationOutputDTO } from "./Common/PaginationDTO.js";

export interface GetActiveProvidersInputDTO extends PaginationInputDTO{
    extraFilter?: {
        selectedService?: string;
        nearByFilter?: string;
        ratingFilter?: number;
        availabilityFilter?: string;
    };
    coordinates: {
        latitude: number;
        longitude: number;
    }
}

export interface GetActiveProvidersOutputDTO extends PaginationOutputDTO<ActiveProviderDTO> { }

export interface ActiveProviderDTO {
    providerId : string
    user: {
        userId: string,
        fname: string;
        lname: string;
    };
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
    isOnline: boolean;
    averageRating: number;
    totalRatings: number;
}