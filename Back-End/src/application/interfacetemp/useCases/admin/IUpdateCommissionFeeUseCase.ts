import { CommissionFeeDTO } from "../../../dtos/CommissionFeeDTO";

export interface IUpdateCommissionFeeUseCase {
    execute(commissionFee:number):Promise<CommissionFeeDTO>
}