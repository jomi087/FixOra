import { BookingStatus } from "../../../shared/Enums/BookingStatus.js";
import { ProviderResponseStatus } from "../../../shared/Enums/ProviderResponse.js";

export interface UpdateBookingStatusInputDTO  {
  bookingId: string;
  action: Exclude<ProviderResponseStatus, ProviderResponseStatus.PENDING>;
  reason?: string;
}

export interface UpdateBookingStatusOutputDTO  {
  bookingId: string; 
  userId: string;
  scheduledAt: Date;
  status: BookingStatus;
  reason?: string;
}
 