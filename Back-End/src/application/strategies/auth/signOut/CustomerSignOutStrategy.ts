import { IUserRepository } from "../../../../domain/interface/repositoryInterface/IUserRepository";
import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../../shared/const/Messages";

import { ISignOutStrategy } from "../../../interface/strategies/auth/ISignOutStrategy";
import { SignOutDTO } from "../../../dto/auth/SingOutDTO";
import { AppError } from "../../../../shared/errors/AppError";

const { BAD_REQUEST } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;


export class CustomerSignOutStrategy implements ISignOutStrategy {
    constructor(
        private readonly _userRepository: IUserRepository,
    ) { }

    async execute(input: SignOutDTO): Promise<void> {
        try {
            //clear refresh token
            if (!(await this._userRepository.resetRefreshTokenById(input.userId))) {
                throw new AppError(BAD_REQUEST, NOT_FOUND_MSG("User"));
            }
        } catch (error:unknown) {
            throw error;

        }
    }
}