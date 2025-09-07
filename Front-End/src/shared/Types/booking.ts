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

export interface ConfirmJobBookings {
  bookingId: string;
  scheduledAt: Date;
  status: BookingStatus;
  acknowledgment: {
    isWorkCompletedByProvider: boolean;
    isWorkConfirmedByUser: boolean;
  };
}

export interface BookingsHistory {
  bookingId: string;
  scheduledAt: Date;
  status: BookingStatus;
  acknowledgment: {
    isWorkCompletedByProvider: boolean;
    isWorkConfirmedByUser: boolean;
  };
}

export interface jobHistory extends BookingsHistory{}

export interface BookingInfoDetails {
  bookingId: string;
  providerUser: {
    providerUserId: string;
    fname: string;
    lname: string;
    email: string;
    image: string
  };
  scheduledAt: string;
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
    imageUrl: string[];
    isWorkConfirmedByUser: boolean;
  };
}

export interface JobInfoDetails {
  bookingId: string;
  user: {
    userId: string;
    fname: string;
    lname: string;
    email: string;
    location: AddressWithCoordinates ;
  };
  scheduledAt: string;
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
    imageUrl: string[];
    isWorkConfirmedByUser: boolean;
  };
}