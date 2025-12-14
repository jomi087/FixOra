import { InitializeCommissionFeeUseCase } from "../../application/useCases/public/InitializeCommissionFeeUseCase";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService";
import { CommissionFeeRepository } from "../database/repositories/CommissionFeeRepository";

export const initializeCommissionFee = async (logger: ILoggerService) => {
    const commissionFeeRepository = new CommissionFeeRepository();
    const initializeFee = new InitializeCommissionFeeUseCase(commissionFeeRepository, logger);
    await initializeFee.execute();
};


