import { PlatformFee } from "../../../domain/entities/PlatfromFeeEntity";
import { IPlatformFeeRepository } from "../../../domain/interface/RepositoryInterface/IPlatformFeeRepository";
import PlatformFeeModel from "../models/PlatformFeeModel";

export class PlatformFeeRepository implements IPlatformFeeRepository {
    async findPlatformFeeData(): Promise<PlatformFee | null> {
        return await PlatformFeeModel.findOne().lean<PlatformFee>() || null;
    }

    async createPlatformFeeData(data: PlatformFee): Promise<PlatformFee> {
        return await new PlatformFeeModel(data).save();
    }

    async updatePlatformFee(data: PlatformFee): Promise<PlatformFee | null> {
        return await PlatformFeeModel.findOneAndUpdate({}, data, { new: true });
    }
} 