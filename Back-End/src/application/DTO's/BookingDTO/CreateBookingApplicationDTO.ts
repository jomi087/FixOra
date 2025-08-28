import { BookingStatus } from "../../../shared/Enums/BookingStatus";

export interface CreateBookingApplicationDTO {
    userId: string;
    providerUserId: string
    providerId: string
    scheduledAt: Date;
    issueTypeId: string;
    issue: string;
    coordinates: {
        latitude: number;
        longitude: number;
    }
}

export interface CreateBookingApplicationInputDTO  extends CreateBookingApplicationDTO { }

export interface CreateBookingApplicationOutputDTO  {
      bookingId: string;
      scheduledAt: Date;
      status: BookingStatus;
}