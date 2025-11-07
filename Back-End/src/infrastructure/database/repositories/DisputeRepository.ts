import { Dispute } from "../../../domain/entities/DIsputeEntity";
import { IDisputeRepository } from "../../../domain/interface/RepositoryInterface/IDisputeRepository";
import { DisputeModel } from "../models/DisputeModel";


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
        
        return existing  ? true : false;
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

    /** @inheritdoc */
    async findAll(filters?: Partial<Dispute>): Promise<Dispute[]> {
        return DisputeModel.find(filters || {}).lean();
    }
}