import { BookingStatus } from "../../../shared/enums/BookingStatus";
import { PaymentStatus } from "../../../shared/enums/Payment";
import { ProviderResponseStatus } from "../../../shared/enums/ProviderResponse";
import { Booking } from "../../entities/BookingEntity";
import { Category, Subcategory } from "../../entities/CategoryEntity";
import { Provider } from "../../entities/ProviderEntity";
import { User } from "../../entities/UserEntity";

export interface IBookingRepository {
  create(booking: Booking): Promise<string>;
  findByBookingId(bookingId: string): Promise<Booking | null>;

  findExistingBooking(providerId: string, scheduledAt: Date): Promise<Booking | null>;

  findProviderPendingBookingRequestInDetails(providerUserId: string): Promise<{
    userInfo: Pick<User, "fname" | "lname">
    bookingInfo: Pick<Booking, "bookingId" | "scheduledAt" | "issue">
    subCategoryInfo: Pick<Subcategory, "subCategoryId" | "name">
  }[]>

  updateBookingStatus(bookingId: string, status: BookingStatus): Promise<void>;

  updateProviderResponseAndStatus(
    bookingId: string,
    status: BookingStatus,
    response: ProviderResponseStatus,
    reason?: string,
    cancelledAt?: Date
  ): Promise<Booking | null>;

  updateBooking(bookingId: string, updateData: Partial<Booking>): Promise<Booking | null>;

  updateProviderResponseAndPaymentStatus(
    bookingId: string,
    response: ProviderResponseStatus,
    paymentStatus: PaymentStatus
  ): Promise<Booking | null>;

  updatePaymentAndStatus(
    bookingId: string,
    status: BookingStatus,
    paymentStatus: PaymentStatus,
    paymentFailureReason: string,
    cancelledAt: Date
  ): Promise<Booking | null>

  findCurrentBookingDetails(bookingId: string): Promise<{
    userInfo: Pick<User, "userId" | "fname" | "lname">
    providerInfo: Pick<User, "userId" | "fname" | "lname">
    bookingInfo: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "provider">
    subCategoryInfo: Pick<Subcategory, "subCategoryId" | "name">
  }>;

  findProviderConfirmBookingsById(providerUserId: string): Promise<Booking[]>

  jobDetailsById(bookingId: string): Promise<{
    user: Pick<User, "userId" | "fname" | "lname" | "email" | "location">,
    category: Pick<Category, "categoryId" | "name">,
    subCategory: Pick<Subcategory, "subCategoryId" | "name">,
    booking: Partial<Booking>
    //booking: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "pricing" | "paymentInfo" | "workProof">
  } | null>

  findProviderJobHistoryById(providerUserId: string, currentPage: number, limit: number): Promise<{ data: Booking[], total: number }>
  findUserBookingHistoryById(userId: string, currentPage: number, limit: number): Promise<{ data: Booking[], total: number }>

  BookingsDetailsById(bookingId: string): Promise<{
    userProvider: Pick<User, "userId" | "fname" | "lname" | "email">,
    provider: Pick<Provider, "profileImage">
    category: Pick<Category, "categoryId" | "name">,
    subCategory: Pick<Subcategory, "subCategoryId" | "name">,
    booking: Partial<Booking>
    // booking: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "pricing" | "paymentInfo" | "workProof">
  } | null>

  findBookingsByWeekday(providerUserId: string, dayIndex: number): Promise<Booking[]>

  findProviderSalesByDateRange(providerUserId: string, start: Date, end: Date): Promise<{
    total: number;
    completed: number;
    cancelled: number;
    pendingWork: number;
    totalCompletedSaleAmount: number;
    refundAmount: number;
    history: Booking[];
  }>;
}


