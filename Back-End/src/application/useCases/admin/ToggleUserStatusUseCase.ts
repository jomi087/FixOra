import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";

export class ToggleUserStatusUseCase {
    constructor(
        private readonly userRepository : IUserRepository
    ) { }

    async execute(userId: string): Promise<void> {
        try {
            const userData = await this.userRepository.findByUserId(userId, ["password", "refreshToken", "googleId", "role"])

            if (!await this.userRepository.update({ userId: userId }, { isBlocked: !userData?.isBlocked })){
                throw { status: 404, message: "User Not Found" }
            }
    
        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: 500, message: 'user status updation failed, (something went wrong)'};
        }
    }
}
