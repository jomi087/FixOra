import { BookingStatus } from "../../../shared/Enums/BookingStatus";
import { AddressDTO } from "../Common/AddressDTO";


export interface BookingDetailsOutputDTO {
    bookingId: string;
    user: {
        userId: string;
        fname: string;
        lname : string;
        location: AddressDTO|string;
    };
    scheduledAt: Date;
    category: {
        categoryId: string;
        name: string;
        subCategory: {
            subCategoryId: string;
            name: string;
        };
    };
    issue: string;
    status: BookingStatus;
    pricing: {
        baseCost: number;
        distanceFee: number;
    };
    acknowledgment: {
        isWorkCompletedByProvider: boolean;
        imageUrl: string;
        isWorkConfirmedByUser: boolean;
    };
}

export interface ConfirmBookingOutputDTO{
    bookingId: string;
    scheduledAt: Date;
    status: BookingStatus;
    acknowledgment: {
        isWorkCompletedByProvider: boolean;
        isWorkConfirmedByUser: boolean;
    } 
}