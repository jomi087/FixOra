import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { IToggleUserStatusUseCase } from "../../interface/useCases/admin/IToggleUserStatusUseCase";
import { AppError } from "../../../shared/errors/AppError";

const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;

export class ToggleUserStatusUseCase implements IToggleUserStatusUseCase {
    constructor(
        private readonly _userRepository: IUserRepository
    ) { }

    async execute(userId: string): Promise<void> {
        try {

            const userData = await this._userRepository.findByUserId(userId, ["password", "refreshToken", "googleId", "role"]);
            if (!await this._userRepository.toogleUserStatusById(userId, !userData?.isBlocked)) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("User"));
            }

        } catch (error: unknown) {
            throw error;
        }
    }
}
