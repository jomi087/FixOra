import { PipelineStage } from "mongoose";
import { Dispute } from "../../../domain/entities/DisputeEntity";
import { IDisputeRepository } from "../../../domain/interface/RepositoryInterface/IDisputeRepository";
import { DisputeModel } from "../models/DisputeModel";
import { User } from "../../../domain/entities/UserEntity";


export class DisputeRepository implements IDisputeRepository {
    /** @inheritdoc */
    async create(dispute: Dispute): Promise<Dispute> {
        const created = await DisputeModel.create(dispute);
        return created.toObject();
    }

    /** @inheritdoc */
    async findById(disputeId: string): Promise<Dispute | null> {
        return DisputeModel.findOne({ disputeId }).lean();
    }

    /** @inheritdoc */
    async findExistingDispute(userId: string, contentId: string): Promise<boolean> {
        const existing = await DisputeModel.findOne({
            reportedBy: userId,
            contentId: contentId
        }).lean();

        return existing ? true : false;
    }

    /** @inheritdoc */
    async findDisputeWithFilters(
        searchQuery: string,
        filterType: string, filterStatus: string,
        page: number, limit: number
    ): Promise<{
        data: {
            dispute: Pick<Dispute, "disputeId" | "disputeType" | "reason" | "status" | "createdAt">
            user: Pick<User, "userId" |"fname" | "lname" | "email" | "role">,
        }[]; total: number;
    }> {

        const search: Record<string, unknown> = {};
        if (searchQuery.trim()) {
            search.$or = [
                { reason: { $regex: searchQuery, $options: "i" } },
                { disputeId: { $regex: searchQuery, $options: "i" } },
                { "userDetails.fname": { $regex: searchQuery, $options: "i" } },
                { "userDetails.lname": { $regex: searchQuery, $options: "i" } },
            ];
        }
        const query: Record<string, unknown> = {};
        if (filterType) query.disputeType = filterType;
        if (filterStatus) query.status = filterStatus;

        const pipeline: PipelineStage[] = [
            {
                $lookup: {
                    from: "users",
                    localField: "reportedBy",
                    foreignField: "userId",
                    as: "userDetails",
                    pipeline: [
                        {
                            $project: { userId: 1, fname: 1, lname: 1, email: 1, role: 1, _id: 0 },
                        },
                    ],
                },
            },
            { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
            {
                $match: {
                    ...query,
                    ...(searchQuery.trim() ? search : {})
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $project: {
                    _id: 0,
                    dispute: {
                        disputeId: "$disputeId",
                        disputeType: "$disputeType",
                        reason: "$reason",
                        status: "$status",
                        createdAt: "$createdAt",
                    },
                    user: {
                        userId: { $ifNull: ["$userDetails.userId", "N/A"] },
                        fname: { $ifNull: ["$userDetails.fname", "N/A"] },
                        lname: { $ifNull: ["$userDetails.lname", "N/A"] },
                        email: { $ifNull: ["$userDetails.email", "N/A"] },
                        role: { $ifNull: ["$userDetails.role", "N/A"] },
                    },
                },
            },
            {
                $facet: {
                    data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
                    total: [{ $count: "count" }],
                },
            },
        ];

        const result = await DisputeModel.aggregate(pipeline);
        const data = result[0]?.data ?? [];
        const total = result[0]?.total ?? 0;

        return { data, total };
    }

    /** @inheritdoc */
    async updateStatus(
        disputeId: string,
        status: string,
        adminNote?: { adminId: string; action: string }
    ): Promise<Dispute | null> {
        return DisputeModel.findOneAndUpdate(
            { disputeId },
            {
                status,
                adminNote,
                resolvedAt: status === "RESOLVED" ? new Date() : undefined,
            },
            { new: true }
        ).lean();
    }

}
