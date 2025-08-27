import { Booking } from "../../../domain/entities/BookingEntity.js";
import { Subcategory } from "../../../domain/entities/CategoryEntity.js";
import { User } from "../../../domain/entities/UserEntity.js";
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository.js";
import { BookingStatus } from "../../../shared/Enums/BookingStatus.js";
import { PaymentStatus } from "../../../shared/Enums/Payment.js";
import { ProviderResponseStatus } from "../../../shared/Enums/ProviderResponse.js";
import BookingModel from "../models/BookingModel.js";

export class BookingRepository implements IBookingRepository {

    async create(booking: Booking): Promise<string> {
        let bookingData = await new BookingModel(booking).save() as Booking
        return bookingData.bookingId
    }

    async findByBookingId(bookingId: string): Promise<Booking | null> {
        return await BookingModel.findOne({ bookingId }).lean()
    }

    async findExistingBooking(providerId: string, scheduledAt:Date ): Promise<Booking|null>{
        return await BookingModel.findOne({
            providerId,
            scheduledAt, 
            status: {
                $nin: [ProviderResponseStatus.REJECTED] 
            }
        }) 
    }

    async updateProviderResponseAndStatus(
        bookingId: string,
        status: BookingStatus,
        response: ProviderResponseStatus,
        reason?: string,
    ): Promise<Booking | null> {
        
        const booking = await BookingModel.findOneAndUpdate(
            { bookingId },
            { $set: { "provider.response": response, "provider.reason": reason, status } },
            { new: true }
        ).lean<Booking>()
        return booking
    }

    async updateBooking(bookingId: string, updatedBooking: Booking): Promise<Booking|null> {
        return BookingModel.findOneAndUpdate(
            { bookingId },     
            { $set: updatedBooking },   
            { new: true }       
        ).lean();
    }

    // async updatePaymentResponseAndStatus(
    //     bookingId: string,
    //     status: BookingStatus,
    //     paymentStatus : PaymentStatus,
    //     reason?: string,
    // ): Promise<Booking | null> {
        
    //     const booking = await BookingModel.findOneAndUpdate(
    //         { bookingId },
    //         { $set: { "paymentInfo.status": paymentStatus, "paymentInfo.reason": reason, status } },
    //         { new: true }
    //     ).lean<Booking>()
    //     return booking
    // }

    async updateProviderResponseAndPaymentStatus (
        bookingId: string,
        response: ProviderResponseStatus,
        paymentStatus: PaymentStatus
    ) : Promise<Booking | null> {
        const booking = await BookingModel.findOneAndUpdate(
            { bookingId },
            { $set: { "provider.response": response, "paymentInfo.status": paymentStatus } },
            { new: true }
        ).lean<Booking>()
        return booking
    }

    async findCurrentBookingDetails(bookingId: string): Promise<{
        userInfo: Pick<User, "userId" | "fname" | "lname">
        providerInfo: Pick<User, "userId" | "fname" | "lname">
        bookingInfo: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "provider">
        subCategoryInfo : Pick<Subcategory, "subCategoryId" | "name">
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
                    userInfo: {
                        userId: "$userDetails.userId",
                        fname: "$userDetails.fname",
                        lname: "$userDetails.lname",
                    },
                    providerInfo: {
                        userId: "$providerDetails.userId",
                        fname: "$providerDetails.fname",
                        lname: "$providerDetails.lname",
                        response : "$provider.response",
                    },
                    bookingInfo: {
                        bookingId: "$bookingId",
                        scheduledAt: "$scheduledAt",
                        issue: "$issue",
                        status : "$status"
                    },
                    subCategoryInfo: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$serviceDetails.subcategories",
                                    as: "sub",
                                    cond: { $eq: ["$$sub.subCategoryId", "$issueTypeId"] }
                                }
                            },0
                        ]
                    }

                }
            }
        ]

        interface AggregatedResult {
            userInfo: Pick<User, "userId" | "fname" | "lname">
            providerInfo: Pick<User, "userId" | "fname" | "lname">
            bookingInfo: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "provider">
            subCategoryInfo: Pick<Subcategory, "subCategoryId" | "name">
        }

        const result = await BookingModel.aggregate<AggregatedResult>(pipeline)
        return result[0]
    }

    async findPendingOlderThan(minutes: number): Promise<Booking[]>{
        const cutoff = new Date(Date.now() - minutes * 60 * 1000);
        return await BookingModel.find({status: "pending",createdAt: { $lt: cutoff }});
    }
    
    
}