import { Schema, model, Document } from "mongoose";
import { Rating } from "../../../domain/entities/RatingEntity.js";

export interface IRatingModel extends Rating, Document {}

const RatingSchema = new Schema<IRatingModel>(
  {
    providerId: { type: String, required: true, uniqueu: true },
    userId: { type: String, required: true ,unique:true},
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const RatingModel = model<IRatingModel>("Rating", RatingSchema);
