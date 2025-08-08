import { Booking } from "../../entities/BookingEntity.js";
import { Subcategory } from "../../entities/CategoryEntity.js";
import { User } from "../../entities/UserEntity.js";

export interface IBookingRepository {
  create(booking: Booking): Promise<string>;
  findCurrentBookingDetails(bookingId: string): Promise<{
    user: Pick<User, "userId" | "fname" | "lname">
    provider: Pick<User, "userId" | "fname" | "lname">
    booking: Pick<Booking, "bookingId" |"providerId" | "fullDate" | "time" | "issue">
    subCategory : Pick<Subcategory, "subCategoryId" | "name">
  }>
}
