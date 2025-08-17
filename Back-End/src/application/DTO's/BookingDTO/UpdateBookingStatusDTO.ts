import { BookingStatus } from "../../../shared/Enums/BookingStatus.js";

export interface UpdateBookingStatusInputDTO  {
  bookingId: string;
  status: Exclude<BookingStatus, BookingStatus.PENDING>;
  reason?: string;
}

export interface UpdateBookingStatusOutputDTO  {
  bookingId: string; 
  userId: string;
  fullDate: string;
  time: string;
  status: BookingStatus;
   reason?: string;
}
 