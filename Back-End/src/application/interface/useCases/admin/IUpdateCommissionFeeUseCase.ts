import { CommissionFeeDTO } from "../../../dto/CommissionFeeDTO";

export interface IUpdateCommissionFeeUseCase {
    execute(commissionFee:number):Promise<CommissionFeeDTO>
}