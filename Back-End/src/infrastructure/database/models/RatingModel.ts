import { Schema, model, Document } from "mongoose";
import { Rating } from "../../../domain/entities/RatingEntity";

export interface IRatingModel extends Rating, Document {}

const RatingSchema = new Schema<IRatingModel>(
    {
        bookingId: { type: String, required: true, uniqueu: true },
        providerId: { type: String, required: true },
        userId: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        feedback: { type: String, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const RatingModel = model<IRatingModel>("Rating", RatingSchema);
