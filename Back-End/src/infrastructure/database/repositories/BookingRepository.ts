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
            status: { $nin: [BookingStatus.CANCELLED] }
        });
    }

    async findProviderPendingBookingRequestInDetails(providerUserId: string): Promise<{
        userInfo: Pick<User, "fname" | "lname">
        bookingInfo: Pick<Booking, "bookingId" | "scheduledAt" | "issue">
        subCategoryInfo: Pick<Subcategory, "subCategoryId" | "name">
    }[]> {
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    providerUserId: providerUserId,
                    status: BookingStatus.PENDING,
                    "provider.response": ProviderResponseStatus.PENDING,
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
            bookingInfo: Pick<Booking, "bookingId" | "scheduledAt" | "issue">
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

    async updateScheduleDateandTime(bookingId: string, timeStamp: Date): Promise<Booking | null> {
        const updatedData = await BookingModel.findOneAndUpdate(
            { bookingId },
            { $set: { scheduledAt: timeStamp } },
            { new: true }
        ).lean();

        if (!updatedData) return null;

        const booking: Booking = {
            bookingId: updatedData.bookingId,
            userId: updatedData.userId,
            location: updatedData.location,
            providerUserId: updatedData.providerUserId,
            provider: {
                id: updatedData.provider.id,
                response: updatedData.provider.response,
                reason: updatedData.provider.reason,
            },
            scheduledAt: updatedData.scheduledAt,
            issueTypeId: updatedData.issueTypeId,
            issue: updatedData.issue,
            status: updatedData.status,
            pricing: updatedData.pricing,
            commission: updatedData.commission,
            paymentInfo: updatedData.paymentInfo,
            esCrowAmout: updatedData.esCrowAmout,
            diagnosed: updatedData.diagnosed,
            workProof: updatedData.workProof,
            cancelledAt: updatedData.cancelledAt,
            createdAt: updatedData.createdAt,
            updatedAt: updatedData.updatedAt,
        };

        return booking;
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
        user: Pick<User, "userId" | "fname" | "lname" | "email" >,
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
                        location: "$location",
                        scheduledAt: "$scheduledAt",
                        issue: "$issue",
                        status: "$status",
                        pricing: {
                            baseCost: "$pricing.baseCost",
                            distanceFee: "$pricing.distanceFee",
                        },
                        commission: "$commission",
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
            user: Pick<User, "userId" | "fname" | "lname" | "email" >,
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
        provider: Pick<Provider, "providerId" | "profileImage">
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
                        providerId: "$providerDetails.providerId",
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
            provider: Pick<Provider, "providerId" | "profileImage">
            category: Pick<Category, "categoryId" | "name">,
            subCategory: Pick<Subcategory, "subCategoryId" | "name">,
            //booking: Pick<Booking, "bookingId" | "scheduledAt" | "issue" | "status" | "pricing" | "paymentInfo" | "workProof">
            booking: Partial<Booking>
        }

        const [result] = await BookingModel.aggregate<AggregatedResult>(pipeline);
        return result ?? null;
    }

    async findBookingsByWeekday(providerUserId: string, dayIndex: number): Promise<Booking[]> {
        return BookingModel.find({
            providerUserId,
            status: { $eq: BookingStatus.CONFIRMED },
            $expr: { $eq: [{ $dayOfWeek: "$scheduledAt" }, dayIndex + 1] }
        });
    }

    async findBookingsByUtcRange(
        providerUserId: string, dayIndex: number,
        utcStartString: string, utcEndString: string
    ): Promise<Booking[]> {

        const docs = await BookingModel.find({
            providerUserId,
            status: BookingStatus.CONFIRMED,
            scheduledAt: { $gte: new Date() }, // only future bookings
            $expr: {
                $and: [
                    // Match weekday (1=Sun ... 7=Sat)
                    { $eq: [{ $dayOfWeek: "$scheduledAt" }, dayIndex + 1] },

                    // Match time window converted to HH:MM (UTC)
                    {
                        $and: [
                            {
                                $gte: [
                                    { $dateToString: { format: "%H:%M", date: "$scheduledAt", timezone: "UTC" } },
                                    utcStartString
                                ]
                            },
                            {
                                $lt: [
                                    { $dateToString: { format: "%H:%M", date: "$scheduledAt", timezone: "UTC" } },
                                    utcEndString
                                ]
                            }
                        ]
                    }
                ]
            }
        }).lean();

        return docs.map(d => ({
            bookingId: d.bookingId,
            userId: d.userId,
            location: d.location,
            providerUserId: d.providerUserId,
            provider: d.provider,
            scheduledAt: d.scheduledAt,
            issueTypeId: d.issueTypeId,
            issue: d.issue,
            status: d.status,
            pricing: d.pricing,
            commission: d.commission,
            paymentInfo: d.paymentInfo,
            esCrowAmout: d.esCrowAmout,
            diagnosed: d.diagnosed,
            workProof: d.workProof,
            cancelledAt: d.cancelledAt,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt
        }));
    }


    async findProviderSalesByDateRange(providerUserId: string, start: Date, end: Date): Promise<{
        total: number;
        completed: number;
        cancelled: number;
        pendingWork: number;
        totalCompletedSaleAmount: number;
        refundAmount: number;
        history: Booking[];
    }> {
        const result = await BookingModel.aggregate([
            {
                $match: {
                    "provider.response": ProviderResponseStatus.ACCEPTED,
                    status: { $nin: [BookingStatus.PENDING] },
                    providerUserId: providerUserId,
                    "paymentInfo.paidAt": { $gte: start, $lte: end },
                },
            },
            {
                $facet: {
                    summary: [
                        {
                            $group: {
                                _id: null,
                                total: { $sum: 1 },
                                completed: {
                                    $sum: {
                                        $cond: [{ $eq: ["$status", BookingStatus.COMPLETED] }, 1, 0],
                                    },
                                },
                                cancelled: {
                                    $sum: {
                                        $cond: [{ $eq: ["$status", BookingStatus.CANCELLED] }, 1, 0],
                                    },
                                },
                                pendingWork: {
                                    $sum: {
                                        $cond: [{ $in: ["$status", [BookingStatus.CONFIRMED, BookingStatus.INITIATED]] }, 1, 0,],
                                    },
                                },
                                totalCompletedSaleAmount: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ["$status", BookingStatus.COMPLETED] },
                                            {
                                                $subtract: [
                                                    {
                                                        $add: [
                                                            { $ifNull: ["$pricing.baseCost", 0] },
                                                            { $ifNull: ["$pricing.distanceFee", 0] }
                                                        ]
                                                    },
                                                    { $ifNull: ["$commission", 0] }
                                                ]
                                            },
                                            0
                                        ]
                                    }
                                },
                                refundAmount: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $and: [
                                                    { $eq: ["$status", BookingStatus.CANCELLED] },
                                                    { $eq: ["$paymentInfo.status", PaymentStatus.PARTIAL_REFUNDED] },
                                                ],
                                            },
                                            {
                                                $subtract: [
                                                    {
                                                        $multiply: [
                                                            {
                                                                $add: [
                                                                    { $ifNull: ["$pricing.baseCost", 0] },
                                                                    { $ifNull: ["$pricing.distanceFee", 0] },
                                                                ],
                                                            },
                                                            0.5, // 50% refund portion
                                                        ],
                                                    },
                                                    { $ifNull: ["$commission", 0] }, // remove commission
                                                ],
                                            },
                                            0,
                                        ],
                                    },
                                },
                            },
                        },
                    ],
                    history: [
                        { $match: { status: BookingStatus.COMPLETED } },
                        { $sort: { scheduledAt: -1 } },
                    ],
                },
            },
            {
                $project: {
                    summary: { $arrayElemAt: ["$summary", 0] },
                    history: 1,
                },
            },
        ]);
        const { summary, history } = result[0] || {};

        return {
            total: summary?.total || 0,
            completed: summary?.completed || 0,
            cancelled: summary?.cancelled || 0,
            pendingWork: summary?.pendingWork || 0,
            totalCompletedSaleAmount: summary?.totalCompletedSaleAmount || 0,
            refundAmount: summary?.refundAmount || 0,
            history: history || [],
        };
    }

    async dashboardBookingStats(start: Date, end: Date): Promise<{
        totalRevenue: number;
        penalityRevenue: number;
        bookingStatsByDate: { date: string; totalBookings: number; totalRevenue: number }[];
        bookingCountByService: { serviceName: string; count: number }[];
        topProviders: { providerUserId: string; providerName: string; jobCount: number }[];
    }> {
        const result = await BookingModel.aggregate([
            {
                $match: {
                    "provider.response": ProviderResponseStatus.ACCEPTED,
                    status: { $nin: [BookingStatus.PENDING] },
                    // "paymentInfo.paidAt": { $exists: true, $gte: start, $lte: end },
                },
            },
            {
                $facet: {
                    totalRevenue: [
                        {
                            $group: {
                                _id: null,
                                total: {
                                    $sum: {
                                        $cond: [{ $eq: ["$status", BookingStatus.COMPLETED] }, "$commission", 0],
                                    },
                                },
                            },
                        },
                    ],
                    penalityRevenue: [
                        {
                            $group: {
                                _id: null,
                                total: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $and: [
                                                    { $eq: ["$status", BookingStatus.CANCELLED] },
                                                    { $eq: ["$paymentInfo.status", PaymentStatus.PARTIAL_REFUNDED] },
                                                ],
                                            },
                                            "$commission", 0
                                        ],
                                    },
                                },
                            },
                        },
                    ],
                    bookingStats: [
                        {
                            $match: {
                                "paymentInfo.paidAt": { $gte: start, $lte: end },
                            },
                        },
                        {
                            $group: {
                                _id: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$paymentInfo.paidAt",
                                    },
                                },
                                bookingCount: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ["$status", BookingStatus.COMPLETED] },
                                            1,
                                            0
                                        ]
                                    }
                                },
                                revenue: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ["$status", BookingStatus.COMPLETED] },
                                            "$commission",
                                            0,
                                        ],
                                    },
                                },
                            },
                        },
                        { $sort: { _id: 1 } },
                        {
                            $project: {
                                _id: 0,
                                date: "$_id",
                                totalBookings: "$bookingCount",
                                totalRevenue: "$revenue",
                            },
                        },
                    ],
                    bookingCountByService: [
                        {
                            $match: {
                                "paymentInfo.paidAt": { $gte: start, $lte: end },
                                status: BookingStatus.COMPLETED
                            }
                        },

                        //  count bookings per subcategory (issueTypeId)
                        { $group: { _id: "$issueTypeId", count: { $sum: 1 } } },

                        // lookup main category that contains this subcategory
                        {
                            $lookup: {
                                from: "categories",
                                let: { issueTypeId: "$_id" },
                                pipeline: [
                                    { $unwind: "$subcategories" },
                                    { $match: { $expr: { $eq: ["$subcategories.subCategoryId", "$$issueTypeId"] } } },
                                    { $project: { _id: 0, mainCategoryName: "$name" } } // only take main category name
                                ],
                                as: "serviceDetails"
                            }
                        },

                        // unwind the lookup result to get object (if no match, preserveNull... depends on your preference)
                        { $unwind: { path: "$serviceDetails", preserveNullAndEmptyArrays: true } },

                        // now group by the main category name to accumulate counts across subcategories
                        {
                            $group: {
                                _id: "$serviceDetails.mainCategoryName", // this becomes the main category key
                                totalCount: { $sum: "$count" }
                            }
                        },

                        // project to friendly shape and sort
                        {
                            $project: {
                                _id: 0,
                                serviceName: { $ifNull: ["$_id", "Unknown"] }, // handle missing category
                                count: "$totalCount"
                            }
                        },
                        { $sort: { count: -1 } }
                    ],
                    topProviders: [
                        {
                            $match: {
                                status: BookingStatus.COMPLETED,
                                "paymentInfo.paidAt": { $gte: start, $lte: end },
                            },
                        },
                        { $group: { _id: "$providerUserId", jobCount: { $sum: 1 } } },
                        { $sort: { jobCount: -1 } },
                        { $limit: 3 },
                        {
                            $lookup: {
                                from: "users",
                                localField: "_id",  //_id = providerUserId after grouping
                                foreignField: "userId",
                                as: "providerDetails",
                            },
                        },
                        {
                            $project: {
                                providerUserId: "$_id",
                                providerName: {
                                    $concat: [
                                        { $arrayElemAt: ["$providerDetails.fname", 0] },
                                        " ",
                                        { $arrayElemAt: ["$providerDetails.lname", 0] },
                                    ],
                                },
                                jobCount: 1,
                            },
                        },
                    ],
                },
            },
        ]);

        const data = {
            totalRevenue: result[0]?.totalRevenue?.[0]?.total || 0,
            penalityRevenue: result[0]?.penalityRevenue?.[0]?.total || 0,
            bookingStatsByDate: result[0]?.bookingStats || [],
            bookingCountByService: result[0]?.bookingCountByService || [],
            topProviders: result[0]?.topProviders || [],
        };

        return data;
    }

}


/*
{
            totalRevenue: number;
        bookingStatsByDate: { date: Date; totalBookings: number; totalRevenue:number }[];
        bookingCountByService: { serviceName: string; count: number }[];
        topProviders: { providerName: string; jobCount: number }[];
}

penalityRevenue: {
    $sum: {
        $cond: [
            {
                $and: [
                    { $eq: ["$status", BookingStatus.CANCELLED] },
                    { $eq: ["$paymentInfo.status", PaymentStatus.PARTIAL_REFUNDED] },
                ],
            },
            { $ifNull: ["$commission", 0] },
            0,
        ],
    },
},
*/


