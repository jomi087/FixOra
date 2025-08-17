import { Booking } from "../../../domain/entities/BookingEntity.js";
import { Subcategory } from "../../../domain/entities/CategoryEntity.js";
import { User } from "../../../domain/entities/UserEntity.js";
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository.js";
import { BookingStatus } from "../../../shared/Enums/BookingStatus.js";
import BookingModel from "../models/BookingModel.js";

export class BookingRepository implements IBookingRepository {

    async create(booking: Booking): Promise<string> {
        let bookingData = await new BookingModel(booking).save() as Booking
        return bookingData.bookingId
    }

    async findByBookingId(bookingId: string): Promise<Booking | null> {
        return await BookingModel.findOne({ bookingId }).lean()
    }

    async findExistingBooking(providerId: string, time: string, fullDate: string): Promise<Booking|null>{
        return await BookingModel.findOne({
            providerId,
            time,
            fullDate,
            status: {
                $nin: [BookingStatus.REJECTED] 
            }
        }) 
    }

    async updateStatus(bookingId: string, status: {status: BookingStatus, reason?: string }):Promise<Booking|null>{
        return await BookingModel.findOneAndUpdate(
            {bookingId},
            { $set: status },
            { new: true }
        ).lean<Booking>()
    }

    async findCurrentBookingDetails(bookingId: string): Promise<{
        user: Pick<User, "userId" | "fname" | "lname">
        provider: Pick<User, "userId" | "fname" | "lname">
        booking: Pick<Booking, "bookingId" | "providerId" | "fullDate" | "time" | "issue" | "status">
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
                $project: {
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
                        providerId: "$providerId",
                        fullDate: "$fullDate",
                        time: "$time",
                        issue: "$issue",
                        status : "$status"
                    },
                    subCategory: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$serviceDetails.subcategories",
                                    as: "sub",
                                    cond: { $eq: ["$$sub.subCategoryId", "$issueTypeId"] }
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
            booking: Pick<Booking, "bookingId" | "providerId" | "fullDate" | "time" | "issue" | "status" >
            subCategory: Pick<Subcategory, "subCategoryId" | "name">
        }

        const result = await BookingModel.aggregate<AggregatedResult>(pipeline)
        return result[0]
    }

    async findPendingOlderThan(minutes: number): Promise<Booking[]>{
        const cutoff = new Date(Date.now() - minutes * 60 * 1000);
        return await BookingModel.find({status: "pending",createdAt: { $lt: cutoff }});
    }
    
    
}