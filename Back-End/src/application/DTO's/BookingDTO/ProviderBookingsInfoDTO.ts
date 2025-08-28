import { BookingStatus } from "../../../shared/Enums/BookingStatus";
import { Gender } from "../../../shared/Enums/Gender";

export interface ProviderBookingsInfoDTO {
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
    profileImage: string;
    serviceCharge: number;
    isOnline: boolean;
    distanceFee: number;
}

export interface ProviderBookingsInfoInputDTO{
    id: string;
    coordinates: {
        latitude: number;
        longitude: number;
    }
}

export interface ProviderBookingsInfoOutputDTO extends ProviderBookingsInfoDTO {}