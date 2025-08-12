import { BookingStatus } from "../../shared/Enums/BookingStatus.js";

export interface Booking {
    bookingId : string //uuid
    userId: string;
    providerId: string;
    providerUserId : string
    fullDate: string;
    time: string;
    issueTypeId: string;
    issue: string;
    status: BookingStatus;
    reason?: string;
    createdAt?: Date;    
    updatedAt?: Date; 
}
