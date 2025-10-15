import { PipelineStage } from "mongoose";
import { Booking } from "../../../domain/entities/BookingEntity";
import { Category, Subcategory } from "../../../domain/entities/CategoryEntity";
import { Provider } from "../../../domain/entities/ProviderEntity";
import { User } from "../../../domain/entities/UserEntity";
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { BookingStatus } from "../../../shared/enums/BookingStatus";
import { PaymentStatus } from "../../../shared/enums/Payment";
import { ProviderResponseStatus } from "../../../shared/enums/ProviderResponse";
import BookingModel from "../models/BookingModel";

export class BookingRepository implements IBookingRepository {

    async create(booking: Booking): Promise<string> {
        let bookingData = await new BookingModel(booking).save() as Booking;
        return bookingData.bookingId;
    }

    async findByBookingId(bookingId: string): Promise<Booking | null> {
        return await BookingModel.findOne({ bookingId });
    }

    async findExistingBooking(providerId: string, scheduledAt: Date): Promise<Booking | null> {
        return await BookingModel.findOne({
            "provider.id": providerId,
            scheduledAt,
            "provider.response": { $nin: [ProviderResponseStatus.REJECTED] },
            status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] }
        });
    }

    async findProviderPendingBookingRequestInDetails(providerUserId: string): Promise<{
        userInfo: Pick<User, "fname" | "lname" >
        bookingInfo: Pick<Booking, "bookingId" | "scheduledAt" | "issue" >
        subCategoryInfo: Pick<Subcategory, "subCategoryId" | "name">
    }[]> {
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    providerUserId: providerUserId,
                    status: BookingStatus.PENDING
                }
            },
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
                        // userId: "$userDetails.userId",
                        fname: "$userDetails.fname",
                        lname: "$userDetails.lname",
                    },
                    bookingInfo: {
                        bookingId: "$bookingId",
                        scheduledAt: "$scheduledAt",
                        issue: "$issue",
                        // status: "$status",
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
            userInfo: Pick<User, "fname" | "lname">
            bookingInfo: Pick<Booking, "bookingId" | "scheduledAt" | "issue" >
            subCategoryInfo: Pick<Subcategory, "subCategoryId" | "name">
        }

        const result = await BookingModel.aggregate<AggregatedResult>(pipeline);
        return result;
    }


    async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<void> {
        await BookingModel.updateOne(
            { bookingId },
            { $set: { status } }
        );
    }

    async updateProviderResponseAndStatus(
        bookingId: string,
        status: BookingStatus,
        response: ProviderResponseStatus,
        reason?: string,
        cancelledAt?: Date,
    ): Promise<Booking | null> {

        const booking = await BookingModel.findOneAndUpdate(
            { bookingId },
            {
                $set: {
                    "provider.response": response,
                    status,
                    ...(reason !== undefined && { "provider.reason": reason }),
                    ...(cancelledAt !== undefined && { cancelledAt }),
                }
            },
            { new: true }
        ).lean<Booking>();
        return booking;
    }

    async updateBooking(bookingId: string, updateData: Partial<Booking>): Promise<Booking | null> {
        return BookingModel.findOneAndUpdate(
            { bookingId },
            { $set: updateData },
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

    async updatePaymentAndStatus(
        bookingId: string,
        status: BookingStatus,
        paymentStatus: PaymentStatus,
        paymentFailureReason: string,
        cancelledAt: Date,
    ): Promise<Booking | null> {
        const booking = await BookingModel.findOneAndUpdate(
            { bookingId },
            {
                $set: {
                    status,
                    cancelledAt,
                    "paymentInfo.status": paymentStatus,
                    "paymentInfo.reason": paymentFailureReason,
                }
            },
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
        const pipeline: PipelineStage[] = [
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

    async findProviderConfirmBookingsById(providerUserId: string): Promise<Booking[]> {
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    providerUserId: providerUserId,
                    //status: BookingStatus.CONFIRMED,
                    status: { $in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
                    scheduledAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
                }
            },
        ];

        const result = await BookingModel.aggregate<Booking>(pipeline);
        return result;
    }

    async jobDetailsById(bookingId: string): Promise<{
        user: Pick<User, "userId" | "fname" | "lname" | "email" | "location">,
        category: Pick<Category, "categoryId" | "name">,
        subCategory: Pick<Subcategory, "subCategoryId" | "name">,
        //booking: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "pricing" | "paymentInfo" | "workProof" | >
        booking: Partial<Booking>
    } | null> {
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    bookingId: bookingId,
                    status: { $nin: [PaymentStatus.PENDING] },
                    "provider.response": ProviderResponseStatus.ACCEPTED,
                    "paymentInfo.status": { $nin: [PaymentStatus.FAILED, PaymentStatus.PENDING] }
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
                        email: "$userDetails.email",
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
                        paymentInfo: {
                            mop: "$paymentInfo.mop",
                            status: "$paymentInfo.status",
                            paidAt: "$paymentInfo.paidAt",
                            transactionId: "$paymentInfo.transactionId",
                            reason: "$paymentInfo.reason",
                        },
                        workProof: "$workProof",
                        diagnosed: "$diagnosed"
                    }
                }
            }
        ];

        interface AggregatedResult {
            user: Pick<User, "userId" | "fname" | "lname" | "email" | "location">,
            category: Pick<Category, "categoryId" | "name">,
            subCategory: Pick<Subcategory, "subCategoryId" | "name">,
            //booking: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "pricing" | "paymentInfo" | "workProof">
            booking: Partial<Booking>
        }

        const [result] = await BookingModel.aggregate<AggregatedResult>(pipeline);
        return result ?? null;
    }

    async findProviderJobHistoryById(providerUserId: string, currentPage: number, limit: number): Promise<{ data: Booking[]; total: number; }> {
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    providerUserId: providerUserId,
                    status: { $nin: [BookingStatus.PENDING] },
                    "provider.response": ProviderResponseStatus.ACCEPTED,
                    "paymentInfo.status": { $nin: [PaymentStatus.FAILED, PaymentStatus.PENDING] }
                }
            },
            {
                $sort: { scheduledAt: -1 },
            },
            {
                $facet: {
                    data: [
                        { $skip: (currentPage - 1) * limit },
                        { $limit: limit },
                    ],
                    total: [{ $count: "count" }]
                }
            }
        ];

        const result = await BookingModel.aggregate(pipeline).exec();

        const data = result[0]?.data ?? [];
        const total = result[0]?.total[0]?.count ?? 0;

        return { data, total };
    }

    async findUserBookingHistoryById(userId: string, currentPage: number, limit: number): Promise<{ data: Booking[], total: number }> {
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    userId: userId,
                    //status: { $in: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED] },
                    status: { $nin: [BookingStatus.PENDING] },
                    "provider.response": ProviderResponseStatus.ACCEPTED,
                }
            },
            {
                $sort: { scheduledAt: -1 },
            },
            {
                $facet: {
                    data: [
                        { $skip: (currentPage - 1) * limit },
                        { $limit: limit },
                    ],
                    total: [{ $count: "count" }]
                }
            }
        ];

        const result = await BookingModel.aggregate(pipeline).exec();

        const data = result[0]?.data ?? [];
        const total = result[0]?.total[0]?.count ?? 0;

        return { data, total };
    }

    async BookingsDetailsById(bookingId: string): Promise<{
        userProvider: Pick<User, "userId" | "fname" | "lname" | "email">,
        provider: Pick<Provider, "profileImage">
        category: Pick<Category, "categoryId" | "name">,
        subCategory: Pick<Subcategory, "subCategoryId" | "name">,
        //booking: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "pricing" | "paymentInfo" | "workProof">
        booking: Partial<Booking>
    } | null> {
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    bookingId: bookingId,
                    //status: { $in: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED] },
                    status: { $nin: [BookingStatus.PENDING] },
                    "provider.response": ProviderResponseStatus.ACCEPTED
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "providerUserId",
                    foreignField: "userId",
                    as: "providerUserDetails"
                }
            },
            { $unwind: "$providerUserDetails" },
            {
                $lookup: {
                    from: "providers",
                    localField: "providerUserId",
                    foreignField: "userId",
                    as: "providerDetails"
                },
            },
            { $unwind: "$providerDetails" },
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
                    userProvider: {
                        userId: "$providerUserDetails.userId",
                        fname: "$providerUserDetails.fname",
                        lname: "$providerUserDetails.lname",
                        email: "$providerUserDetails.email",
                    },
                    provider: {
                        profileImage: "$providerDetails.profileImage"
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
                        paymentInfo: {
                            mop: "$paymentInfo.mop",
                            status: "$paymentInfo.status",
                            paidAt: "$paymentInfo.paidAt",
                            transactionId: "$paymentInfo.transactionId",
                            reason: "$paymentInfo.reason",
                        },
                        workProof: "$workProof",
                        diagnosed: "$diagnosed"
                    }
                }
            }
        ];

        interface AggregatedResult {
            userProvider: Pick<User, "userId" | "fname" | "lname" | "email">,
            provider: Pick<Provider, "profileImage">
            category: Pick<Category, "categoryId" | "name">,
            subCategory: Pick<Subcategory, "subCategoryId" | "name">,
            //booking: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "pricing" | "paymentInfo" | "workProof">
            booking: Partial<Booking>
        }

        const [result] = await BookingModel.aggregate<AggregatedResult>(pipeline);
        return result ?? null;
    }

    async findBookingsByWeekday(providerId: string, dayIndex: number): Promise<Booking[]> {
        return BookingModel.find({
            providerUserId: providerId,
            status: { $eq: BookingStatus.CONFIRMED },
            $expr: { $eq: [{ $dayOfWeek: "$scheduledAt" }, dayIndex + 1] }
        });
    }

}