import type { BookingStatus } from "../enums/BookingStatus";
import type { ProviderResponseStatus } from "../enums/ProviderResponseStatus";

export type BookingRequestPayload = {
  bookingId: string;
  userName: string;
  issueType: string;
  scheduledAt : Date,
  issue: string;
}

export type BookingResponsePayload = {
  bookingId: string;
  response: ProviderResponseStatus;
  scheduledAt : Date,
  reason?: string;

}

export type BookingAutoRejectPayload = {
  bookingId: string
  response: ProviderResponseStatus;
  reason: string
}

export interface PaymentSuccessNotification {
  bookingId: string
  status: BookingStatus
}

export interface PaymentFailureNotification {
  bookingId: string
  reason: string
  status: BookingStatus

}