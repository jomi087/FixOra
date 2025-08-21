import { BookingStatus } from "../../../shared/Enums/BookingStatus.js";
import { ProviderResponseStatus } from "../../../shared/Enums/ProviderResponse.js";
import { Booking } from "../../entities/BookingEntity.js";
import { Subcategory } from "../../entities/CategoryEntity.js";
import { User } from "../../entities/UserEntity.js";

export interface IBookingRepository {
  create(booking: Booking): Promise<string>;
  findByBookingId(bookingId: string): Promise<Booking | null>;
  
  findExistingBooking(providerId :string ,scheduledAt:Date ):Promise<Booking|null>

  updateResponseAndStatus(
    bookingId: string,
    status: BookingStatus,
    response: ProviderResponseStatus,
    reason?: string
  ): Promise<Booking | null>;

  updateResponse(bookingId: string,response: ProviderResponseStatus,): Promise<Booking | null>;
  
  findCurrentBookingDetails(bookingId: string): Promise<{
    userInfo: Pick<User, "userId" | "fname" | "lname">
    providerInfo: Pick<User, "userId" | "fname" | "lname">
    bookingInfo: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "provider">
    subCategoryInfo : Pick<Subcategory, "subCategoryId" | "name">
  }>


}
