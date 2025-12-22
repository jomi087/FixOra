import { CommissionFee } from "../../../domain/entities/CommissionFeeEntity";
import { ICommissionFeeRepository } from "../../../domain/interface/repositoryInterface/ICommissionFeeRepository";
import { COMMISSION_FEE } from "../../../shared/const/constants";
import { CommissionFeeDTO } from "../../dtos/CommissionFeeDTO";
import { ICommissionFeeUseCase } from "../../Interface/useCases/admin/ICommissionFeeUseCase";

export class CommissionFeeUseCase implements ICommissionFeeUseCase {
    constructor(
        private readonly _commissionFeeRepository: ICommissionFeeRepository,

    ) { }

    async execute(): Promise<CommissionFeeDTO> {
        try {
            let commissionFeeData: CommissionFee | null;
            commissionFeeData = await this._commissionFeeRepository.findCommissionFeeData();
            if (!commissionFeeData) {
                commissionFeeData = await this._commissionFeeRepository.createCommissionFeeData({
                    fee: COMMISSION_FEE,
                    feeHistory: [],
                });
            }
            const history = commissionFeeData.feeHistory.length > 0 ? commissionFeeData.feeHistory.map((f) => ({
                amount: f.amount,
                createdAt: f.createdAt
            })) : [];

            const mappedData: CommissionFeeDTO = {
                fee: commissionFeeData.fee,
                feeHistory: history
            };

            return mappedData;

        } catch (error: unknown) {
            throw error;
        }
    }
}