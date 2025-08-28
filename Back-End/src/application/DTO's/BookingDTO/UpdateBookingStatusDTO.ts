import { BookingStatus } from "../../../shared/Enums/BookingStatus";
import { ProviderResponseStatus } from "../../../shared/Enums/ProviderResponse";

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
 