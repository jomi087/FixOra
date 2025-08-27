import { BookingStatus } from "../../../shared/Enums/BookingStatus.js";
import { PaymentStatus } from "../../../shared/Enums/Payment.js";
import { ProviderResponseStatus } from "../../../shared/Enums/ProviderResponse.js";
import { Booking } from "../../entities/BookingEntity.js";
import { Subcategory } from "../../entities/CategoryEntity.js";
import { User } from "../../entities/UserEntity.js";

export interface IBookingRepository {
  create(booking: Booking): Promise<string>;
  findByBookingId(bookingId: string): Promise<Booking | null>;
  
  findExistingBooking(providerId :string ,scheduledAt:Date ):Promise<Booking|null>

  updateProviderResponseAndStatus(
    bookingId: string,
    status: BookingStatus,
    response: ProviderResponseStatus,
    reason?: string
  ): Promise<Booking | null>;

  updateBooking(bookingId: string, updatedBooking: Booking): Promise<Booking|null> 

  // updatePaymentResponseAndStatus(
  //   bookingId: string,
  //   status: BookingStatus,
  //   paymentStatus : PaymentStatus,
  //   reason?: string
  // ): Promise<Booking | null>;

  updateProviderResponseAndPaymentStatus(
    bookingId: string,
    response: ProviderResponseStatus,
    paymentStatus: PaymentStatus
  ): Promise<Booking | null>;
  
  findCurrentBookingDetails(bookingId: string): Promise<{
    userInfo: Pick<User, "userId" | "fname" | "lname">
    providerInfo: Pick<User, "userId" | "fname" | "lname">
    bookingInfo: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "provider">
    subCategoryInfo : Pick<Subcategory, "subCategoryId" | "name">
  }>


}
