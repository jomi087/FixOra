import { IUserRepository } from "../../../../domain/interface/RepositoryInterface/IUserRepository";
import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../../shared/const/Messages";
import { ISignOutStrategy } from "../../../Interface/strategies/auth/ISignOutStrategy";
import { SignOutDTO } from "../../../DTOs/AuthDTO/SingOutDTO";


const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { USER_NOT_FOUND, INTERNAL_ERROR } = Messages;

export class AdminSignOutStrategy implements ISignOutStrategy {
    constructor(
        private readonly _userRepository: IUserRepository,
    ) { }

    async execute(input: SignOutDTO): Promise<void> {
        try {
            //clear refresh token
            if (!(await this._userRepository.resetRefreshTokenById(input.userId))) {
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