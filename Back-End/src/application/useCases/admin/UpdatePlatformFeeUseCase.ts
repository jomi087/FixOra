import { IPlatformFeeRepository } from "../../../domain/interface/RepositoryInterface/IPlatformFeeRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { PlatformFeeDTO } from "../../DTOs/PlatformFeeDTO";
import { IUpdatePlatformFeeUseCase } from "../../Interface/useCases/Admin/IUpdatePlatformFeeUseCase";


const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;


export class UpdatePlatformFeeUseCase implements IUpdatePlatformFeeUseCase {
    constructor(
        private readonly _platformFeeRepository: IPlatformFeeRepository,
    ) { }

    async execute(platformFee: number): Promise<PlatformFeeDTO> {

        try {
            const platformFeeData = await this._platformFeeRepository.findPlatformFeeData();
            if (!platformFeeData) throw { status: NOT_FOUND, message: "platform fee data not found " };

            platformFeeData.feeHistory.push({
                amount: platformFee,
                createdAt: new Date(),
            });
            platformFeeData.fee = platformFee;

            const updatedFeeData = await this._platformFeeRepository.updatePlatformFee(platformFeeData);
            if (!updatedFeeData) throw { status: NOT_FOUND, message: "Platform fee Updation failed" };

            const mappedData: PlatformFeeDTO = {
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