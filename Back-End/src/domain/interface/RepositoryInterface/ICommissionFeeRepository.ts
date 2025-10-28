import { CommissionFee } from "../../entities/CommissionFeeEntity";

export interface ICommissionFeeRepository {
    findCommissionFeeData(): Promise<CommissionFee | null>
    createCommissionFeeData(data: CommissionFee): Promise<CommissionFee>
    updateCommissionFee(data: CommissionFee): Promise<CommissionFee| null>
}