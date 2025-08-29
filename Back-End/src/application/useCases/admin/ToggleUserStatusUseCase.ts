import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/Messages";
import { IToggleUserStatusUseCase } from "../../Interface/useCases/Admin/IToggleUserStatusUseCase";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, USER_NOT_FOUND } = Messages;

export class ToggleUserStatusUseCase implements IToggleUserStatusUseCase {
    constructor(
        private readonly _userRepository : IUserRepository
    ) { }

    async execute(userId: string): Promise<void> {
        try {
            
            const userData = await this._userRepository.findByUserId(userId, ["password", "refreshToken", "googleId", "role"]);
            if (!await this._userRepository.toogleUserStatusById(userId, !userData?.isBlocked)){
                throw { status: NOT_FOUND, message: USER_NOT_FOUND  };
            }

        } catch (error:any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}
