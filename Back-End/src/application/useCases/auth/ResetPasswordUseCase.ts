import jwt from "jsonwebtoken";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { IHashService } from "../../../domain/interface/ServiceInterface/IHashService.js";


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
                 throw { status: 404, message: "User Not Found" };
            }

        } catch (error: any) {
            console.log(error)
            if (error.status && error.message) {
               throw error;
            }
            throw { status: 500, message: "Reset Password failed, (something went wrong)" };
        }
    }
}