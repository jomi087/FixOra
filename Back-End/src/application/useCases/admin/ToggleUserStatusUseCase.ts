import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { IToggleUserStatusUseCase } from "../../Interface/useCases/Admin/IToggleUserStatusUseCase";
import { AppError } from "../../../shared/errors/AppError";

const { NOT_FOUND } = HttpStatusCode;
const { USER_NOT_FOUND } = Messages;

export class ToggleUserStatusUseCase implements IToggleUserStatusUseCase {
    constructor(
        private readonly _userRepository: IUserRepository
    ) { }

    async execute(userId: string): Promise<void> {
        try {

            const userData = await this._userRepository.findByUserId(userId, ["password", "refreshToken", "googleId", "role"]);
            if (!await this._userRepository.toogleUserStatusById(userId, !userData?.isBlocked)) {
                throw new AppError(NOT_FOUND, USER_NOT_FOUND);
            }

        } catch (error: unknown) {
            throw error;
        }
    }
}
