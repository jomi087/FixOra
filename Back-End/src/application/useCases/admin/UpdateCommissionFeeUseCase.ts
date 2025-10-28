import { ICommissionFeeRepository } from "../../../domain/interface/RepositoryInterface/ICommissionFeeRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { CommissionFeeDTO } from "../../DTOs/CommissionFeeDTO";
import { IUpdateCommissionFeeUseCase } from "../../Interface/useCases/Admin/IUpdateCommissionFeeUseCase";


const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;


export class UpdateCommissionFeeUseCase implements IUpdateCommissionFeeUseCase {
    constructor(
        private readonly _commissionFeeRepository: ICommissionFeeRepository,
    ) { }

    async execute(commissionFee: number): Promise<CommissionFeeDTO> {

        try {
            const commissionFeeData = await this._commissionFeeRepository.findCommissionFeeData();
            if (!commissionFeeData) throw { status: NOT_FOUND, message: "commission fee data not found " };

            commissionFeeData.feeHistory.push({
                amount: commissionFee,
                createdAt: new Date(),
            });
            commissionFeeData.fee = commissionFee;

            const updatedFeeData = await this._commissionFeeRepository.updateCommissionFee(commissionFeeData);
            if (!updatedFeeData) throw { status: NOT_FOUND, message: "commission fee Updation failed" };

            const mappedData: CommissionFeeDTO = {
                fee: updatedFeeData.fee,
                feeHistory: updatedFeeData.feeHistory.map((f) => ({
                    amount: f.amount,
                    createdAt: f.createdAt
                }))
            };

            return mappedData;

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}