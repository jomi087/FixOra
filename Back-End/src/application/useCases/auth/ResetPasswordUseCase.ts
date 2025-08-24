import jwt from "jsonwebtoken";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { IHashService } from "../../../domain/interface/ServiceInterface/IHashService.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";
import { IResetPasswordUseCase } from "../../Interface/useCases/Auth/IResetPasswordUseCase.js";

const {NOT_FOUND,INTERNAL_SERVER_ERROR} = HttpStatusCode
const { USER_NOT_FOUND, INTERNAL_ERROR } = Messages

export class ResetPasswordUseCase implements IResetPasswordUseCase{
    constructor(
        private readonly _hashService : IHashService,
        private readonly _userRepository : IUserRepository,
    ) { }
    
    async execute( token : string , password : string ):Promise<void> {
        try {
            const hashedPassword = await this._hashService.hash( password ) 

            const decodeEmail = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET as string) as { email : string}
            
            if (!await this._userRepository.resetPasswordByEmail(decodeEmail.email ,hashedPassword )) {
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