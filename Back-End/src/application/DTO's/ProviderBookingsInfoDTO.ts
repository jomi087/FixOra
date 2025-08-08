import { Gender } from "../../shared/Enums/Gender.js";

export interface ProviderBookingsInfoDTO {
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
    distanceFee:number

    //array add Booking data (date and time (available not available booked selected etc ...))  
}

export interface ProviderBookingsInfoInputDTO{
    id: string;
    coordinates: {
        latitude: number;
        longitude: number;
    }
}

export interface ProviderBookingsInfoOutputDTO extends ProviderBookingsInfoDTO {}