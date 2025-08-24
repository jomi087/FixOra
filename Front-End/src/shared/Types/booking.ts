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

export interface PaymentFailedNotification {
  bookingId: string
  reason: string
}
