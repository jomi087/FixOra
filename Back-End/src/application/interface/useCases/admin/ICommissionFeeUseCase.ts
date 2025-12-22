import { CommissionFeeDTO } from "../../../dto/CommissionFeeDTO";

export interface ICommissionFeeUseCase {
    execute():Promise<CommissionFeeDTO>
}