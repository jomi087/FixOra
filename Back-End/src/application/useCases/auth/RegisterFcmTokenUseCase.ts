import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enumss/HttpStatusCode";
import { RoleEnum } from "../../../shared/enumss/Roles";
import { AppError } from "../../../shared/errors/AppError";
import { RegisterFcmTokenInputDTO } from "../../dtos/RegisterFcmTokenDTO";
import { IRegisterFcmTokenUseCase } from "../../Interface/useCases/auth/IRegisterFcmTokenUseCase";

const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;

export class RegisterFcmTokenUseCase implements IRegisterFcmTokenUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
    ) { }
    async execute(input: RegisterFcmTokenInputDTO): Promise<void> {
        try {
            const { userId, FcmToken, platform } = input;

            let user = await this._userRepository.findByUserId(userId);
            if (!user || user.role != RoleEnum.Provider) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("User"));

            const exists = user.fcmTokens?.some(t => t.token === FcmToken);

            if (!exists) {
                await this._userRepository.addFcmToken(userId, FcmToken, platform);
            }

        } catch (error: unknown) {
            throw error;
        }
    }
}