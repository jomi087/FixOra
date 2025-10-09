import { BookingStatus } from "../../../shared/enums/BookingStatus";
import { ProviderResponseStatus } from "../../../shared/enums/ProviderResponse";

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
 