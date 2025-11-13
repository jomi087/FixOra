import { PipelineStage } from "mongoose";
import { Rating } from "../../../domain/entities/RatingEntity";
import { User } from "../../../domain/entities/UserEntity";
import { IRatingRepository } from "../../../domain/interface/RepositoryInterface/IRaitingRepository";
import { RatingModel } from "../models/RatingModel";
// import { ITransactionSession } from "../../../domain/interface/DatabaseInterface/ITransactionManager";

export class RatingRepository implements IRatingRepository {
    /** @inheritdoc */
    async findByBookingID(bookingId: string): Promise<Rating | null> {
        return RatingModel.findOne({ bookingId }).lean();
    }

    /** @inheritdoc */
    async create(rating: Rating): Promise<void> {
        await new RatingModel(rating).save();
    }

    /** @inheritdoc */
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
                    active: true
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

    /** @inheritdoc */
    async findReviewById(ratingId: string): Promise<{
        rating: Pick<Rating, "ratingId" | "rating" | "feedback" | "createdAt">;
        user: Pick<User, "userId" | "fname" | "lname" | "email" | "role">;
    }> {
        const result = await RatingModel.aggregate([
            {
                $match: { ratingId: ratingId }
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
                $project: {
                    _id: 0,
                    rating: {
                        ratingId: "$ratingId",
                        rating: "$rating",
                        feedback: "$feedback",
                        createdAt: "$createdAt"
                    },
                    user: {
                        userId: "$userDetails.userId",
                        fname: "$userDetails.fname",
                        lname: "$userDetails.lname",
                        email: "$userDetails.email",
                        role: "$userDetails.role"
                    }
                }
            }
        ]);
        return result[0];
    }

    /** @inheritdoc */
    async updateRating(ratingId: string,
        updateData: Partial<{ rating: number; feedback: string }>
    ): Promise<Rating | null> {

        return await RatingModel.findOneAndUpdate(
            { ratingId: ratingId },
            { $set: updateData },
            { new: true }
        ).lean();
    }

    /** @inheritdoc */
    async deactivateRating(ratingId: string /*txSession?: ITransactionSession*/): Promise<boolean> {
        // const session = (txSession as any)?.nativeSession;
        const result = await RatingModel.findOneAndUpdate(
            { ratingId },
            { $set: { active: false, updatedAt: new Date() } },
            { new: true } //{ new: true, session }
        );

        return !!result;
    }



}