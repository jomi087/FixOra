import { Rating } from "../../entities/RatingEntity";
import { User } from "../../entities/UserEntity";
// import { ITransactionSession } from "../DatabaseInterface/ITransactionManager";

export interface IRatingRepository {
    /**
     * Retrieves a rating by its associated booking ID.
     * @param bookingId 
     * @returns A Promise resolving to the rating entity if found, otherwise null.
    */
    findByBookingID(bookingId: string): Promise<Rating | null>;

    /**
     * Persists a new rating entity in the database.
     * @param rating 
     * @returns A Promise that resolves when the rating is successfully created.
     */
    create(rating: Rating): Promise<void>

    /**
     * Retrieves all active (non-deactivated) reviews for a specific provider.
     * Applies pagination and returns a lightweight response containing rating and reviewer details.
     * @param providerId 
     * @param currentPage 
     * @param limit
     * @returns A Promise resolving to paginated review data, including total count and reviewer info.
     */
    findActiveProviderReviews(providerId: string, currentPage: number, limit: number): Promise<{
        data: {
            rating: Pick<Rating, "ratingId" | "rating" | "feedback" | "createdAt">;
            user: Pick<User, "userId" | "fname" | "lname">;
        }[]
        total: number
    }>

    /**
     * Retrieves detailed information about a specific review by its rating ID.
     * This method returns both the review content and the user who created it.
     * @param ratingId
     * @returns A Promise resolving to the rating and its associated user details.
     */
    findReviewById(ratingId: string): Promise<{
        rating: Pick<Rating, "ratingId" | "rating" | "feedback" | "createdAt">;
        user: Pick<User, "userId" | "fname" | "lname" | "email" | "role">;
    }>

    /**
     * Updates a rating entity with new values such as rating score or feedback text. 
     * @param ratingId 
     * @param updateData
     * @returns A Promise resolving to the updated rating entity, or null if not found. 
     */
    updateRating(ratingId: string,
        updateData: Partial<{ rating: number; feedback: string }>
    ): Promise<Rating | null>;

    /**
     * Soft-deactivates a rating record by setting its active flag to false.
     * @param ratingId 
     * @returns A Promise resolving to true if the rating was successfully deactivated, otherwise false.
     */
    deactivateRating(
        ratingId: string,
        // txSession?: ITransactionSession
    ): Promise<boolean>
}


