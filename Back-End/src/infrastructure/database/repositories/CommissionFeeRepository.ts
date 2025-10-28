import { CommissionFee } from "../../../domain/entities/CommissionFeeEntity";
import { ICommissionFeeRepository } from "../../../domain/interface/RepositoryInterface/ICommissionFeeRepository";
import CommissionFeeModel from "../models/CommissionFeeModel";

export class CommissionFeeRepository implements ICommissionFeeRepository {
    async findCommissionFeeData(): Promise<CommissionFee | null> {
        return await CommissionFeeModel.findOne().lean<CommissionFee>() || null;
    }

    async createCommissionFeeData(data: CommissionFee): Promise<CommissionFee> {
        return await new CommissionFeeModel(data).save();
    }

    async updateCommissionFee(data: CommissionFee): Promise<CommissionFee | null> {
        return await CommissionFeeModel.findOneAndUpdate({}, data, { new: true });
    }
} 