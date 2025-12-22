import { DaySchedule } from "../../domain/entities/AvailabilityEntity";
import { BookingStatus } from "../../shared/enums/BookingStatus";
import { Gender } from "../../shared/enums/Gender";

export interface ProviderInfoDTO {
    providerId: string;
    user: {
        userId: string,
        fname: string;
        lname?: string;
    };
    gender: Gender;
    service: {
        categoryId: string
        name: string;
        subcategories: {
            subCategoryId: string;
            name: string;
        }[];
    };
    bookings: {
        bookingId: string;
        scheduledAt: Date;
        status: BookingStatus
    }[],
    availability: DaySchedule[],
    profileImage: string;
    serviceCharge: number;
    isOnline: boolean;
    distanceFee: number;
}

export interface ProviderInfoInputDTO {
    id: string;
    coordinates: {
        latitude: number;
        longitude: number;
    }
}

export interface ProviderInfoOutputDTO extends ProviderInfoDTO { }


export interface ProviderServiceDTO {
    serviceCharge: number;
    category: {
        categoryId: string,
        name: string,
        subcategories: {
            subCategoryId: string;
            name: string;
        }[];
    }
}
export interface ProviderServiceInfoInputDTO extends ProviderServiceDTO{
    providerUserId:string
}

export interface ProviderServiceInfoOutputDTO extends ProviderServiceDTO{
    providerId: string,

}

