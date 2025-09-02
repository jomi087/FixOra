import { BookingStatus } from "../../../shared/Enums/BookingStatus";
import { PaymentStatus } from "../../../shared/Enums/Payment";
import { ProviderResponseStatus } from "../../../shared/Enums/ProviderResponse";
import { Booking } from "../../entities/BookingEntity";
import { Category, Subcategory } from "../../entities/CategoryEntity";
import { User } from "../../entities/UserEntity";

export interface IBookingRepository {
  create(booking: Booking): Promise<string>;
  findByBookingId(bookingId: string): Promise<Booking | null>;

  findExistingBooking(providerId: string, scheduledAt: Date): Promise<Booking | null>;

  updateProviderResponseAndStatus(
    bookingId: string,
    status: BookingStatus,
    response: ProviderResponseStatus,
    reason?: string
  ): Promise<Booking | null>;

  updateBooking(bookingId: string, updatedBooking: Booking): Promise<Booking | null>;

  updateProviderResponseAndPaymentStatus(
    bookingId: string,
    response: ProviderResponseStatus,
    paymentStatus: PaymentStatus
  ): Promise<Booking | null>;

  findCurrentBookingDetails(bookingId: string): Promise<{
    userInfo: Pick<User, "userId" | "fname" | "lname">
    providerInfo: Pick<User, "userId" | "fname" | "lname">
    bookingInfo: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "provider">
    subCategoryInfo: Pick<Subcategory, "subCategoryId" | "name">
  }>;

  findProviderConfirmBookingsById(ProviderUserId: string): Promise<Booking[]>

  ConfirmBookingsDetailsById(bookingId: string): Promise<{
    user: Pick<User, "userId" | "fname" | "lname" | "location">,
    category: Pick<Category, "categoryId" | "name">,
    subCategory: Pick<Subcategory, "subCategoryId" | "name">,
    booking: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "pricing" | "acknowledgment">
  }|null >
}


