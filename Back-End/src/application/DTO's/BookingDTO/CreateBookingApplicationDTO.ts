import { BookingStatus } from "../../../shared/Enums/BookingStatus.js";

export interface CreateBookingApplicationDTO {
    userId: string;
    providerId: string
    providerUserId : string
    fullDate: string;
    time: string;
    issueTypeId: string;
    issue: string;
}

export interface CreateBookingApplicationInputDTO  extends CreateBookingApplicationDTO { }

export interface CreateBookingApplicationOutputDTO  {
    user: {
        userId: string;
        fname: string;
        lname: string;
    },
    provider: {
        providerId: string;
        providerUserId: string;
        fname: string;
        lname: string;

    }
    issueType: {
        issueTypeId: string;
        name : string
    }
    bookings: {
      bookingId: string;
      fullDate: string;
      time: string;
      status: BookingStatus;
    }
}