import type { BookingStatus } from "../enums/BookingStatus";
import type { ProviderResponseStatus } from "../enums/ProviderResponseStatus";
import type { AddressWithCoordinates } from "./location";

export type BookingRequestPayload = {
  bookingId: string;
  userName: string;
  issueType: string;
  scheduledAt: Date,
  issue: string;
}

export type BookingResponsePayload = {
  bookingId: string;
  response: ProviderResponseStatus;
  scheduledAt: Date,
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

export interface BookingInfo {
  bookingId: string;
  scheduledAt: Date;
  issue: string;
  status: BookingStatus;
  acknowledgment: {
    isWorkCompletedByProvider: boolean;
    isWorkConfirmedByUser: boolean;
  };
}

export interface BookingDetails {
  bookingId: string;
  user: {
    userId: string;
    fname: string;
    lname: string;
    location: AddressWithCoordinates | string;
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
  acknowledgment?: {
    isWorkCompletedByProvider: boolean;
    imageUrl: string;
    isWorkConfirmedByUser: boolean;
  };
}