import { IUserRepository } from "../../../../domain/interface/RepositoryInterface/IUserRepository";
import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../../shared/const/Messages";
import { ISignOutStrategy } from "../../../Interface/strategies/auth/ISignOutStrategy";
import { SignOutDTO } from "../../../DTOs/AuthDTO/SingOutDTO";


const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { USER_NOT_FOUND, INTERNAL_ERROR } = Messages;

export class ProviderSignOutStrategy implements ISignOutStrategy {
    constructor(
        private readonly _userRepository: IUserRepository,
    ) { }

    async execute(input: SignOutDTO): Promise<void> {
        try {
            if (!input.fcmToken) throw { status: BAD_REQUEST, message: "FCM TOKEN MISSING" };
            //clear fcm token and refreshToken
            if (!(await this._userRepository.clearTokensById(input.userId, input.fcmToken))) {
                throw { status: BAD_REQUEST, message: USER_NOT_FOUND };
            }
        } catch (error) {
            if (error.status && error.message) throw error;

            throw {
                status: INTERNAL_SERVER_ERROR,
                message: INTERNAL_ERROR
            };
        }
    }
}