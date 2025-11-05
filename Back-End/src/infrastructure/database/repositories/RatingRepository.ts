import { PipelineStage } from "mongoose";
import { Rating } from "../../../domain/entities/RatingEntity";
import { User } from "../../../domain/entities/UserEntity";
import { IRatingRepository } from "../../../domain/interface/RepositoryInterface/IRaitingRepository";
import { RatingModel } from "../models/RatingModel";

export class RatingRepository implements IRatingRepository {
    async findByBookingID(bookingId: string): Promise<Rating | null> {
        return RatingModel.findOne({ bookingId }).lean();
    }

    async create(rating: Rating): Promise<void> {
        await new RatingModel(rating).save();
    }

    async findActiveProviderReviews(providerId: string, currentPage: number, limit: number): Promise<{
        data: {
            rating: Pick<Rating, "ratingId" | "rating" | "feedback" | "createdAt">;
            user: Pick<User, "userId" | "fname" | "lname">;
        }[];
        total: number;
    }> {

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    providerId: providerId,
                    active:true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $sort: { createdAt: -1 }
            },
            {
                $facet: {
                    data: [
                        { $skip: (currentPage - 1) * limit },
                        { $limit: limit },
                        {
                            $project: {
                                rating: { ratingId: "$ratingId", rating: "$rating", feedback: "$feedback", createdAt: "$createdAt" },
                                user: {
                                    userId: "$userDetails.userId",
                                    fname: "$userDetails.fname",
                                    lname: "$userDetails.lname",
                                },
                            },
                        },
                    ],
                    total: [{ $count: "count" }]
                }
            }
        ];

        const result = await RatingModel.aggregate(pipeline).exec();
        const data = result[0]?.data ?? [];
        const total = result[0]?.total[0]?.count ?? 0;
        return { data, total };
    }

    async updateRating(ratingId: string,
        updateData: Partial<{ rating: number; feedback: string }>
    ): Promise<Rating | null> {

        return await RatingModel.findOneAndUpdate(
            { ratingId: ratingId },
            { $set: updateData },
            { new: true }
        ).lean();
    }
}