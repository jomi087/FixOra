import { PlatformFee } from "../../entities/PlatfromFeeEntity";

export interface IPlatformFeeRepository {
    findPlatformFeeData(): Promise<PlatformFee | null>
    createPlatformFeeData(data: PlatformFee): Promise<PlatformFee>
    updatePlatformFee(data: PlatformFee): Promise<PlatformFee| null>
}