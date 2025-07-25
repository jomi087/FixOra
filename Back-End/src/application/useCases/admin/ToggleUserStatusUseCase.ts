import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { HttpStatusCode } from "../../../shared/constant/HttpStatusCode.js";
import { Messages } from "../../../shared/constant/Messages.js";
import { IToggleUserStatusUseCase } from "../../Interface/useCases/Admin/IToggleUserStatusUseCase.js";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode
const { INTERNAL_ERROR, USER_NOT_FOUND } = Messages

export class ToggleUserStatusUseCase implements IToggleUserStatusUseCase {
    constructor(
        private readonly userRepository : IUserRepository
    ) { }

    async execute(userId: string): Promise<void> {
        try {
            const userData = await this.userRepository.findByUserId(userId, ["password", "refreshToken", "googleId", "role"])

            if (!await this.userRepository.update({ userId: userId }, { isBlocked: !userData?.isBlocked })){
                throw { status: NOT_FOUND, message: USER_NOT_FOUND  }
            }
    
        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}
