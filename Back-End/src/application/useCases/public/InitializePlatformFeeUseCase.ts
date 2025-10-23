import { IPlatformFeeRepository } from "../../../domain/interface/RepositoryInterface/IPlatformFeeRepository";
import { PLATFORM_FEE } from "../../../shared/const/constants";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { IInitializePlatformFeeUseCase } from "../../Interface/useCases/Public/IInitializePlatformFeeUseCase";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class InitializePlatformFeeUseCase implements IInitializePlatformFeeUseCase {
    constructor(
        private readonly _platformFeeRepository: IPlatformFeeRepository,
    ) { }

    async execute(): Promise<void> {
        try {
            const existing = await this._platformFeeRepository.findPlatformFeeData();
            if (!existing) {
                await this._platformFeeRepository.createPlatformFeeData({
                    fee: PLATFORM_FEE,
                    feeHistory: [],
                });
                console.log(" Default platform fee created.");
            } else {
                console.log(" Platform fee already exists, skipping creation.");
            }
        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}
