import { BookingStatus } from "../../../shared/Enums/BookingStatus.js";
import { Booking } from "../../entities/BookingEntity.js";
import { Subcategory } from "../../entities/CategoryEntity.js";
import { User } from "../../entities/UserEntity.js";

export interface IBookingRepository {
  create(booking: Booking): Promise<string>;
  findByBookingId(bookingId: string): Promise<Booking | null>;
  
  findExistingBooking(providerId :string , time : string, fullDate: string):Promise<Booking|null>

  updateStatus(bookingId: string, status: { status: BookingStatus, reason?: string }): Promise<Booking | null>
  
  findCurrentBookingDetails(bookingId: string): Promise<{
    user: Pick<User, "userId" | "fname" | "lname">
    provider: Pick<User, "userId" | "fname" | "lname">
    booking: Pick<Booking, "bookingId" |"providerId" | "fullDate" | "time" | "issue" | "status">
    subCategory : Pick<Subcategory, "subCategoryId" | "name">
  }>


}
