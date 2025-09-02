import { Booking } from "../../../domain/entities/BookingEntity";
import { Category, Subcategory } from "../../../domain/entities/CategoryEntity";
import { User } from "../../../domain/entities/UserEntity";
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { BookingStatus } from "../../../shared/Enums/BookingStatus";
import { PaymentStatus } from "../../../shared/Enums/Payment";
import { ProviderResponseStatus } from "../../../shared/Enums/ProviderResponse";
import BookingModel from "../models/BookingModel";

export class BookingRepository implements IBookingRepository {

    async create(booking: Booking): Promise<string> {
        let bookingData = await new BookingModel(booking).save() as Booking;
        return bookingData.bookingId;
    }

    async findByBookingId(bookingId: string): Promise<Booking | null> {
        return await BookingModel.findOne({ bookingId }).lean();
    }

    async findExistingBooking(providerId: string, scheduledAt: Date): Promise<Booking | null> {
        return await BookingModel.findOne({
            providerId,
            scheduledAt,
            status: {
                $nin: [ProviderResponseStatus.REJECTED]
            }
        });
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
        ).lean<Booking>();
        return booking;
    }

    async updateBooking(bookingId: string, updatedBooking: Booking): Promise<Booking | null> {
        return BookingModel.findOneAndUpdate(
            { bookingId },
            { $set: updatedBooking },
            { new: true }
        ).lean();
    }

    async updateProviderResponseAndPaymentStatus(
        bookingId: string,
        response: ProviderResponseStatus,
        paymentStatus: PaymentStatus
    ): Promise<Booking | null> {
        const booking = await BookingModel.findOneAndUpdate(
            { bookingId },
            { $set: { "provider.response": response, "paymentInfo.status": paymentStatus } },
            { new: true }
        ).lean<Booking>();
        return booking;
    }

    async findCurrentBookingDetails(bookingId: string): Promise<{
        userInfo: Pick<User, "userId" | "fname" | "lname">
        providerInfo: Pick<User, "userId" | "fname" | "lname">
        bookingInfo: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "provider">
        subCategoryInfo: Pick<Subcategory, "subCategoryId" | "name">
    }> {
        const pipeline: any[] = [
            { $match: { bookingId: bookingId } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    as: "userDetails"
                },
            },
            { $unwind: "$userDetails" },
            {
                $lookup: {
                    from: "users",
                    localField: "providerUserId",
                    foreignField: "userId",
                    as: "providerDetails"
                },
            },
            { $unwind: "$providerDetails" },
            {
                $lookup: {
                    from: "categories",
                    localField: "issueTypeId",
                    foreignField: "subcategories.subCategoryId",
                    as: "serviceDetails"
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
                        response: "$provider.response",
                    },
                    bookingInfo: {
                        bookingId: "$bookingId",
                        scheduledAt: "$scheduledAt",
                        issue: "$issue",
                        status: "$status"
                    },
                    subCategoryInfo: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$serviceDetails.subcategories",
                                    as: "sub",
                                    cond: { $eq: ["$$sub.subCategoryId", "$issueTypeId"] }
                                }
                            }, 0
                        ]
                    }

                }
            }
        ];

        interface AggregatedResult {
            userInfo: Pick<User, "userId" | "fname" | "lname">
            providerInfo: Pick<User, "userId" | "fname" | "lname">
            bookingInfo: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "provider">
            subCategoryInfo: Pick<Subcategory, "subCategoryId" | "name">
        }

        const result = await BookingModel.aggregate<AggregatedResult>(pipeline);
        return result[0];
    }

    async findProviderConfirmBookingsById(ProviderUserId: string): Promise<Booking[]> {
        const pipeline: any[] = [
            {
                $match: {
                    providerUserId: ProviderUserId,
                    status: BookingStatus.CONFIRMED,
                    scheduledAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
                }
            },
        ];

        const result = await BookingModel.aggregate<Booking>(pipeline);
        return result;
    }

    async ConfirmBookingsDetailsById(bookingId: string): Promise<{
        user: Pick<User, "userId" | "fname" | "lname" | "location">,
        category: Pick<Category, "categoryId" | "name">,
        subCategory: Pick<Subcategory, "subCategoryId" | "name">,
        booking: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "pricing" | "acknowledgment">
    }|null> {
        const pipeline: any[] = [
            {
                $match: {
                    bookingId: bookingId,
                    status: BookingStatus.CONFIRMED,
                    scheduledAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
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
                $lookup: {
                    from: "categories",
                    let: { issueTypeId: "$issueTypeId" },
                    pipeline: [
                        { $unwind: "$subcategories" },
                        { $match: { $expr: { $eq: ["$subcategories.subCategoryId", "$$issueTypeId"] } } },
                    ],
                    as: "serviceDetails"
                }
            },
            { $unwind: "$serviceDetails" },
            {
                $project: {
                    _id: 0,
                    user: {
                        userId: "$userDetails.userId",
                        fname: "$userDetails.fname",
                        lname: "$userDetails.lname",
                        location: {
                            houseinfo: "$userDetails.location.houseinfo",
                            street: "$userDetails.location.street",
                            district: "$userDetails.location.district",
                            city: "$userDetails.location.city",
                            locality: "$userDetails.location.locality",
                            state: "$userDetails.location.state",
                            postalCode: "$userDetails.location.postalCode",
                            coordinates: "$userDetails.location.coordinates"
                        },
                    },
                    category: {
                        categoryId: "$serviceDetails.categoryId",
                        name: "$serviceDetails.name",
                    },
                    subCategory: {
                        subCategoryId: "$serviceDetails.subcategories.subCategoryId",
                        name: "$serviceDetails.subcategories.name",
                    },
                    booking: {
                        bookingId: "$bookingId",
                        scheduledAt: "$scheduledAt",
                        issue: "$issue",
                        status: "$status",
                        pricing: {
                            baseCost: "$pricing.baseCost",
                            distanceFee: "$pricing.distanceFee",
                        },
                        acknowledgment: {
                            isWorkCompletedByProvider: "$acknowledgment.isWorkCompletedByProvider",
                            imageUrl: "$acknowledgment.imageUrl",
                            isWorkConfirmedByUser: "$acknowledgment.isWorkConfirmedByUser",
                        }
                    }
                }
            }
        ];

        interface AggregatedResult {
            user: Pick<User, "userId" | "fname" | "lname" | "location">,
            category: Pick<Category, "categoryId" | "name">,
            subCategory: Pick<Subcategory, "subCategoryId" | "name">,
            booking: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "pricing" | "acknowledgment">
        }

        const [result] = await BookingModel.aggregate<AggregatedResult>(pipeline);
        return result ?? null ;
    }
}