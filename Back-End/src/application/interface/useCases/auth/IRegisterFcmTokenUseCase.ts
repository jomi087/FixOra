import { RegisterFcmTokenInputDTO } from "../../../dto/RegisterFcmTokenDTO";

export interface IRegisterFcmTokenUseCase {
    execute(input: RegisterFcmTokenInputDTO ): Promise<void>
}

