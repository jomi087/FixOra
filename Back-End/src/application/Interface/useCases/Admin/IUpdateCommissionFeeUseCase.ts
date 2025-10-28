import { CommissionFeeDTO } from "../../../DTOs/CommissionFeeDTO";

export interface IUpdateCommissionFeeUseCase {
    execute(commissionFee:number):Promise<CommissionFeeDTO>
}