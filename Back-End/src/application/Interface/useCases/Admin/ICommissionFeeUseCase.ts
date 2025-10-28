import { CommissionFeeDTO } from "../../../DTOs/CommissionFeeDTO";

export interface ICommissionFeeUseCase {
    execute():Promise<CommissionFeeDTO>
}