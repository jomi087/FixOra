import { KYCRequest } from "../../../domain/entities/KYCRequestEntity.js";
import { IKYCRequestRepository } from "../../../domain/interface/RepositoryInterface/IKYCRequestRepository.js";
import KYCRequestModel from "../models/KYCRequestModel.js";

export class KYCRequestRepository implements IKYCRequestRepository {
    async findByUserId(userId: string): Promise<KYCRequest | null> {
        return await KYCRequestModel.findOne({ userId }).lean();
    }
    
    async create(data: KYCRequest): Promise<void> {
        await new KYCRequestModel(data).save()
    }

    async update(userId: string, updateData: Partial<KYCRequest>): Promise<KYCRequest | null> {
        const updated = await KYCRequestModel.findOneAndUpdate(
        { userId },
        { $set: updateData, reviewedAt: undefined, reviewedBy: undefined, reason: undefined }, 
        { new: true }
        ).lean();
        return updated;
    }


}