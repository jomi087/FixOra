import { z } from "zod";
import { numberMinMax, stringMinMax, uuidField } from "./fields";

export const addReviewSchema = z.object({
    bookingId: uuidField("Booking"),
    rating: numberMinMax(1, "Rating must be at least 1", 5, "Rating cannot exceed 5"),
    feedback: stringMinMax(5, "Comment must be at least 5 characters", 500, "Comment too long")
});

export const updateReviewSchema = z.object({
    ratingId: uuidField("Rating"),
    rating: numberMinMax(1, "Rating must be at least 1", 5, "Rating cannot exceed 5"),
    feedback: stringMinMax(5, "Comment must be at least 5 characters", 500, "Comment too long")
});

export const reportReviewSchema = z.object({
    ratingId: uuidField("Rating"),
    reason: stringMinMax(3, "Comment must be at least 3 characters", 500, "Comment too long")
});

