import { InitializePlatformFeeUseCase } from "../../application/useCases/public/InitializePlatformFeeUseCase";
import { PlatformFeeRepository } from "../database/repositories/PlatformFeeRepository";


export const initializePlatformFee = async () => {
    const platformFeeRepository = new PlatformFeeRepository();
    const initializeFee = new InitializePlatformFeeUseCase(platformFeeRepository);
    await initializeFee.execute();
};


