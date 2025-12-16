import { IUserRepository } from "../../../../domain/interface/RepositoryInterface/IUserRepository";
import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../../shared/const/Messages";
import { ISignOutStrategy } from "../../../Interface/strategies/auth/ISignOutStrategy";
import { SignOutDTO } from "../../../DTOs/AuthDTO/SingOutDTO";
import { AppError } from "../../../../shared/errors/AppError";


const { BAD_REQUEST } = HttpStatusCode;
const { USER_NOT_FOUND, MISSING_TOKEN } = Messages;

export class ProviderSignOutStrategy implements ISignOutStrategy {
    constructor(
        private readonly _userRepository: IUserRepository,
    ) { }

    async execute(input: SignOutDTO): Promise<void> {
        try {
            if (!input.fcmToken) throw new AppError(BAD_REQUEST, MISSING_TOKEN("FCM"));
            //clear fcm token and refreshToken
            if (!(await this._userRepository.clearTokensById(input.userId, input.fcmToken))) {
                throw new AppError(BAD_REQUEST, USER_NOT_FOUND);
            }
        } catch (error: unknown) {
            throw error;
        }
    }
}