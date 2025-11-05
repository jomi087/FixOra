import { Rating } from "../../entities/RatingEntity";
import { User } from "../../entities/UserEntity";

export interface IRatingRepository {
    findByBookingID(bookingId: string): Promise<Rating | null>;
    create(rating: Rating): Promise<void>

    findActiveProviderReviews(providerId: string, currentPage: number, limit: number): Promise<{
        data: {
            rating: Pick<Rating, "ratingId" | "rating" | "feedback" | "createdAt">;
            user: Pick<User, "userId" | "fname" | "lname">;
        }[]
        total: number
    }>

    updateRating(ratingId: string,
        updateData: Partial<{ rating: number; feedback: string }>
    ): Promise<Rating | null>;
}


