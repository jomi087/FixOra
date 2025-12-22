import { CommissionFeeDTO } from "../../../dtos/CommissionFeeDTO";

export interface ICommissionFeeUseCase {
    execute():Promise<CommissionFeeDTO>
}