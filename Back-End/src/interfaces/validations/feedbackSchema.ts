import { z } from "zod";

export const addFeedbackSchema = z.object({
    bookingId: z
        .string()
        .uuid("Invalid BI-format"),
    rating: z
        .number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot exceed 5"),
    feedback: z
        .string()
        .min(5, "Comment must be at least 5 characters")
        .max(500, "Comment too long")
});

export const updateFeedbackSchema = z.object({
    ratingId: z
        .string()
        .uuid("Invalid RI-format"),
    rating: z
        .number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot exceed 5"),
    feedback: z
        .string()
        .min(5, "Comment must be at least 5 characters")
        .max(500, "Comment too long")
});

