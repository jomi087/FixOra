import { Rating } from "../../entities/RatingEntity";

export interface IRatingRepository {
    findByBookingID(bookingId: string): Promise<Rating|null>;
    create(rating: Rating): Promise<void>
    findAllByProviderId(providerId: string): Promise<Rating[]>;
}


