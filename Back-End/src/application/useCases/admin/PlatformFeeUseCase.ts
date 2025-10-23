import { PlatformFee } from "../../../domain/entities/PlatfromFeeEntity";
import { IPlatformFeeRepository } from "../../../domain/interface/RepositoryInterface/IPlatformFeeRepository";
import { PLATFORM_FEE } from "../../../shared/const/constants";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { PlatformFeeDTO } from "../../DTOs/PlatformFeeDTO";
import { IPlatformFeeUseCase } from "../../Interface/useCases/Admin/IPlatformFeeUseCase";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;


export class PlatformFeeUseCase implements IPlatformFeeUseCase {
    constructor(
        private readonly _platformFeeRepository: IPlatformFeeRepository,

    ) { }

    async execute(): Promise<PlatformFeeDTO> {
        try {
            //find 
            let platformFeeData: PlatformFee | null;
            platformFeeData = await this._platformFeeRepository.findPlatformFeeData();
            if (!platformFeeData) {
                platformFeeData = await this._platformFeeRepository.createPlatformFeeData({
                    fee: PLATFORM_FEE,
                    feeHistory: [],
                });
            }
            // console.log("platformFeeData", platformFeeData);
            const history = platformFeeData.feeHistory.length > 0 ? platformFeeData.feeHistory.map((f) => ({
                amount: f.amount,
                createdAt: f.createdAt
            })) : [];

            const mappedData:PlatformFeeDTO = {
                fee: platformFeeData.fee,
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