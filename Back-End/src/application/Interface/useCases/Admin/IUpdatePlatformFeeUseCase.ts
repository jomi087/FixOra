import { PlatformFeeDTO } from "../../../DTOs/PlatformFeeDTO";

export interface IUpdatePlatformFeeUseCase {
    execute(platformFee:number):Promise<PlatformFeeDTO>
}