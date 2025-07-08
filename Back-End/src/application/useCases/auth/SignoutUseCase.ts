import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository.js";

export class SignoutUseCase {
    constructor(
        private readonly userRepository : UserRepository,
    ) {}

    async execute(userId: string) {
        try {
            if (!(await this.userRepository.update({userId}, { refreshToken: "" }))) {
                throw { status: 400, message: "User not found during signout" };
            }            
        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: 500, message: 'signout failed, (something went wrong)'};
        }
    }
}