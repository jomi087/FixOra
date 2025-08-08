import { Booking } from "../../../domain/entities/BookingEntity.js";
import { Subcategory } from "../../../domain/entities/CategoryEntity.js";
import { User } from "../../../domain/entities/UserEntity.js";
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository.js";
import BookingModel from "../models/BookingModel.js";

export class BookingRepository implements IBookingRepository {

    async create(booking : Booking): Promise<string> {
        let bookingData = await new BookingModel(booking).save() as Booking 
        return bookingData.bookingId
    }

    async findCurrentBookingDetails(bookingId: string): Promise<{
        user: Pick<User, "userId" | "fname" | "lname">
        provider: Pick<User, "userId" | "fname" | "lname">
        booking: Pick<Booking, "bookingId" |"providerId" | "fullDate" | "time" | "issue">
        subCategory: Pick<Subcategory, "subCategoryId" | "name">
    }> {
        const pipeline: any[] = [
            { $match: { bookingId: bookingId } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    as: 'userDetails'
                },
            },
            { $unwind: "$userDetails" },
            {
                $lookup: {
                    from: "users",
                    localField: "providerUserId",
                    foreignField: "userId",
                    as: 'providerDetails'
                },
            },
            { $unwind: "$providerDetails" },
            {
                $lookup: {
                    from: "categories",
                    localField: "issueTypeId",
                    foreignField: "subcategories.subCategoryId",
                    as: 'serviceDetails'
                }
            }, { $unwind: "$serviceDetails" },
            {
                $project : {
                    _id: 0,
                    user: {
                        userId: "$userDetails.userId",
                        fname: "$userDetails.fname",
                        lname: "$userDetails.lname",
                    },
                    provider: {
                        userId: "$providerDetails.userId",
                        fname: "$providerDetails.fname",
                        lname: "$providerDetails.lname",
                    },
                    booking: {
                        bookingId: "$bookingId", 
                        providerId : "$providerId",
                        fullDate: "$fullDate",
                        time: "$time",
                        issue: "$issue",
                    },
                    subCategory: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$serviceDetails.subcategories",
                                    as: "sub",
                                    cond : {$eq : ["$$sub.subCategoryId",  "$issueTypeId"] }
                                }
                            },
                            0
                        ]
                    }

                }
            }
        ]

        interface AggregatedResult {
            user: Pick<User, "userId" | "fname" | "lname">
            provider: Pick<User, "userId" | "fname" | "lname">
            booking: Pick<Booking, "bookingId" |"providerId" | "fullDate" | "time" | "issue">
            subCategory : Pick<Subcategory, "subCategoryId" | "name">
        }

        const result = await BookingModel.aggregate<AggregatedResult>(pipeline)
        return result[0]
    }
}
