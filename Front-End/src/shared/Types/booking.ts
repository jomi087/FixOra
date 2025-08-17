import type { BookingStatus } from "../enums/BookingStatus";

export type BookingRequestPayload = {
  bookingId: string;
  userName: string;
  issueType: string;
  fullDate: string;
  time: string;
  issue: string;
}

export type BookingResponsePayload = {
  bookingId: string;
  status: BookingStatus;
  fullDate: string;
  time: string;
  reason?: string;
}

export interface BookingAutoRejectPayload  {
    bookingId: string
    status: BookingStatus;
    reason: string
}