import type { BookingStatus } from "../enums/BookingStatus";
import type { NotificationType } from "../enums/NotificationType";
import type { PaymentMode, PaymentStatus } from "../enums/Payment";
import type { ProviderResponseStatus } from "../enums/ProviderResponseStatus";
import type { AddressWithCoordinates } from "./location";

export interface Notification {
  notificationId?: string;
  type: NotificationType;   // e.g. "BOOKING_CONFIRMED", "BOOKING_CANCELLED"
  title: string;            // short heading
  message: string;          // description
  metadata?: any;            // optional booking/user data
  createdAt: string;
  isRead: boolean;
}

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

export interface ConfirmJobBookings {
  bookingId: string;
  scheduledAt: string;
  status: BookingStatus;
}

export interface BookingsHistory {
  bookingId: string;
  scheduledAt: Date;
  status: BookingStatus;
}

export interface jobHistory extends BookingsHistory { }

export interface BookingInfoDetails {
  bookingId: string;
  providerUser: {
    providerId: string;
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
  paymentInfo: {
    mop?: PaymentMode;
    status: PaymentStatus;
    paidAt?: Date;
    transactionId?: string
    reason?: string;
  };
  diagnosed?: {
    description: string;
    replaceParts?: {
      name: string;
      cost: number;
    }[]
  }
  workProof?: string[];
  
}

export interface JobInfoDetails {
  bookingId: string;
  user: {
    userId: string;
    fname: string;
    lname: string;
    email: string;
    location: AddressWithCoordinates;
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
  commission:number;
  paymentInfo: {
    mop: PaymentMode;
    status: PaymentStatus;
    paidAt: Date;
    transactionId: string
    reason?: string;
  };
  diagnosed?: {
    description: string;
    replaceParts?: {
      name: string;
      cost: number;
    }[]
  }
  workProof?: string[];

}
