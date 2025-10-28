import { CommissionFee } from "../../../domain/entities/CommissionFeeEntity";
import { ICommissionFeeRepository } from "../../../domain/interface/RepositoryInterface/ICommissionFeeRepository";
import { COMMISSION_FEE } from "../../../shared/const/constants";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { CommissionFeeDTO } from "../../DTOs/CommissionFeeDTO";
import { ICommissionFeeUseCase } from "../../Interface/useCases/Admin/ICommissionFeeUseCase";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;


export class CommissionFeeUseCase implements ICommissionFeeUseCase {
    constructor(
        private readonly _commissionFeeRepository: ICommissionFeeRepository,

    ) { }

    async execute(): Promise<CommissionFeeDTO> {
        try {
            //find 
            let commissionFeeData: CommissionFee | null;
            commissionFeeData = await this._commissionFeeRepository.findCommissionFeeData();
            if (!commissionFeeData) {
                commissionFeeData = await this._commissionFeeRepository.createCommissionFeeData({
                    fee: COMMISSION_FEE,
                    feeHistory: [],
                });
            }
            // console.log("commissionFeeData", commissionFeeData);
            const history = commissionFeeData.feeHistory.length > 0 ? commissionFeeData.feeHistory.map((f) => ({
                amount: f.amount,
                createdAt: f.createdAt
            })) : [];

            const mappedData:CommissionFeeDTO = {
                fee: commissionFeeData.fee,
                feeHistory: history
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