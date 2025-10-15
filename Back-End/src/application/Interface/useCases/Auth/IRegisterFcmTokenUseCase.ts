import { RegisterFcmTokenInputDTO } from "../../../DTOs/RegisterFcmTokenDTO";

export interface IRegisterFcmTokenUseCase {
    execute(input: RegisterFcmTokenInputDTO ): Promise<void>
}

