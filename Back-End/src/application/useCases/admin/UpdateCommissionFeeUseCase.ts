import { ICommissionFeeRepository } from "../../../domain/interface/repositoryInterface/ICommissionFeeRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enumss/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { CommissionFeeDTO } from "../../dtos/CommissionFeeDTO";
import { IUpdateCommissionFeeUseCase } from "../../Interface/useCases/admin/IUpdateCommissionFeeUseCase";


const {  NOT_FOUND } = HttpStatusCode;
const {  NOT_FOUND_MSG } = Messages;


export class UpdateCommissionFeeUseCase implements IUpdateCommissionFeeUseCase {
    constructor(
        private readonly _commissionFeeRepository: ICommissionFeeRepository,
    ) { }

    async execute(commissionFee: number): Promise<CommissionFeeDTO> {

        try {
            const commissionFeeData = await this._commissionFeeRepository.findCommissionFeeData();
            if (!commissionFeeData) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("CommissionFee"));

            commissionFeeData.feeHistory.push({
                amount: commissionFee,
                createdAt: new Date(),
            });
            commissionFeeData.fee = commissionFee;

            const updatedFeeData = await this._commissionFeeRepository.updateCommissionFee(commissionFeeData);
            if (!updatedFeeData) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("CommissionFee"));

            const mappedData: CommissionFeeDTO = {
                fee: updatedFeeData.fee,
                feeHistory: updatedFeeData.feeHistory.map((f) => ({
                    amount: f.amount,
                    createdAt: f.createdAt
                }))
            };

            return mappedData;

        } catch (error: unknown) {
            throw error;
        }
    }
}