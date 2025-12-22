import { BookingStatus } from "../../../shared/enumss/BookingStatus";
import { ProviderResponseStatus } from "../../../shared/enumss/ProviderResponse";

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
 