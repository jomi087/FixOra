import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { RoleEnum } from "../../../shared/enums/Roles";
import { RegisterFcmTokenInputDTO } from "../../DTOs/RegisterFcmTokenDTO";
import { IRegisterFcmTokenUseCase } from "../../Interface/useCases/Auth/IRegisterFcmTokenUseCase";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, USER_NOT_FOUND } = Messages;

export class RegisterFcmTokenUseCase implements IRegisterFcmTokenUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
    ) { }
    async execute(input: RegisterFcmTokenInputDTO): Promise<void> {
        try {
            const { userId, FcmToken, platform } = input;

            let user = await this._userRepository.findByUserId(userId);
            if (!user || user.role != RoleEnum.Provider) throw { status: NOT_FOUND, message: USER_NOT_FOUND };
            const exists = user.fcmTokens?.some(t => t.token === FcmToken);
            
            if (!exists) {
                await this._userRepository.addFcmToken(userId, FcmToken, platform);
            }

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}