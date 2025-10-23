import { PlatformFeeDTO } from "../../../DTOs/PlatformFeeDTO";

export interface IPlatformFeeUseCase {
    execute():Promise<PlatformFeeDTO>
}