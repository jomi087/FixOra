import { RegisterFcmTokenInputDTO } from "../../../dtos/RegisterFcmTokenDTO";

export interface IRegisterFcmTokenUseCase {
    execute(input: RegisterFcmTokenInputDTO ): Promise<void>
}

