import { ICommissionFeeRepository } from "../../../domain/interface/RepositoryInterface/ICommissionFeeRepository";
import { ILoggerService } from "../../../domain/interface/ServiceInterface/ILoggerService";
import { COMMISSION_FEE } from "../../../shared/const/constants";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { IInitializeCommissionFeeUseCase } from "../../Interface/useCases/Public/IInitializeCommissionFeeUseCase";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class InitializeCommissionFeeUseCase implements IInitializeCommissionFeeUseCase {
    constructor(
        private readonly _commissionFeeRepository: ICommissionFeeRepository,
        private readonly _logger : ILoggerService,
    ) { }

    async execute(): Promise<void> {
        try {
            const existing = await this._commissionFeeRepository.findCommissionFeeData();
            if (!existing) {
                await this._commissionFeeRepository.createCommissionFeeData({
                    fee: COMMISSION_FEE,
                    feeHistory: [],
                });
                this._logger.info("Default commission fee created.",COMMISSION_FEE);
            } else {
                this._logger.info("Commission fee already exists, skipping creation.");
            }
        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}
