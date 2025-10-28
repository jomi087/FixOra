import { InitializeCommissionFeeUseCase } from "../../application/useCases/public/InitializeCommissionFeeUseCase";
import { CommissionFeeRepository } from "../database/repositories/CommissionFeeRepository";

export const initializeCommissionFee = async () => {
    const commissionFeeRepository = new CommissionFeeRepository();
    const initializeFee = new InitializeCommissionFeeUseCase(commissionFeeRepository);
    await initializeFee.execute();
};


