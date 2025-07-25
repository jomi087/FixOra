import jwt from "jsonwebtoken";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { IHashService } from "../../../domain/interface/ServiceInterface/IHashService.js";
import { HttpStatusCode } from "../../../shared/constant/HttpStatusCode.js";
import { Messages } from "../../../shared/constant/Messages.js";

const {NOT_FOUND,INTERNAL_SERVER_ERROR} = HttpStatusCode
const { USER_NOT_FOUND, INTERNAL_ERROR } = Messages

export class ResetPasswordUseCase{
    constructor(
        private readonly hashService : IHashService,
        private readonly userRepository : IUserRepository,
    ) { }
    
    async execute( token : string , password : string ):Promise<void> {
        try {
            const hashedPassword = await this.hashService.hash( password ) 

            const decodeEmail = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET as string) as { email : string}
            
            if (!await this.userRepository.update({ email: decodeEmail.email }, { password: hashedPassword })) {
                 throw { status: NOT_FOUND, message: USER_NOT_FOUND };
            }

        } catch (error: any) {
            console.log(error)
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}