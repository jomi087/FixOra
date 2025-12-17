import { IUserRepository } from "../../../../domain/interface/repositoryInterface/IUserRepository";
import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../../shared/const/Messages";
import { ISignOutStrategy } from "../../../Interface/strategies/auth/ISignOutStrategy";
import { SignOutDTO } from "../../../dtos/AuthDTO/SingOutDTO";
import { AppError } from "../../../../shared/errors/AppError";


const { BAD_REQUEST } = HttpStatusCode;
const { NOT_FOUND_MSG, MISSING_TOKEN } = Messages;

export class ProviderSignOutStrategy implements ISignOutStrategy {
    constructor(
        private readonly _userRepository: IUserRepository,
    ) { }

    async execute(input: SignOutDTO): Promise<void> {
        try {
            if (!input.fcmToken) throw new AppError(BAD_REQUEST, MISSING_TOKEN("FCM"));
            //clear fcm token and refreshToken
            if (!(await this._userRepository.clearTokensById(input.userId, input.fcmToken))) {
                throw new AppError(BAD_REQUEST, NOT_FOUND_MSG("User"));
            }
        } catch (error: unknown) {
            throw error;
        }
    }
}