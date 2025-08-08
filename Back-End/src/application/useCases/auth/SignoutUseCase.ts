import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";

const { BAD_REQUEST,INTERNAL_SERVER_ERROR} = HttpStatusCode
const { USER_NOT_FOUND, INTERNAL_ERROR } = Messages

export class SignoutUseCase {
    constructor(
        private readonly userRepository : UserRepository,
    ) {}

    async execute(userId: string) {
        try {
            if (!(await this.userRepository.update({userId}, { refreshToken: "" }))) {
                throw { status: BAD_REQUEST, message: USER_NOT_FOUND };
            }            
        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}