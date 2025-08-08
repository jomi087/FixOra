import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import { User } from "../../../domain/entities/UserEntity.js";
import { IHashService } from "../../../domain/interface/ServiceInterface/IHashService.js";
import { IEmailService } from "../../../domain/interface/ServiceInterface/IEmailService.js";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";

const { FORBIDDEN,INTERNAL_SERVER_ERROR} = HttpStatusCode
const { INTERNAL_ERROR, INVALID_PASSWORD } = Messages

export class VerifyPasswordUseCase {
    constructor(
        private readonly userRepository : IUserRepository,
        private readonly hashService : IHashService,
        private readonly emailService: IEmailService
    ) { }
    
    async execute(password: string, userId : string): Promise<void> {
        try {
            const user = await this.userRepository.findByUserId(userId,["refreshToken"]) as User; 
            const isMatch = await this.hashService.compare(password, user.password as string)
            if (!isMatch) throw { status: FORBIDDEN, message: INVALID_PASSWORD }
            
            const expiryTime  = process.env.JWT_TEMP_RESET_TOKEN_EXPIRY as SignOptions['expiresIn']
            const resetToken = jwt.sign({ email: user.email }, process.env.JWT_RESET_PASSWORD_SECRET as string, { expiresIn: expiryTime })

            const url = process.env.FRONTEND_URL || 'http://localhost:5001'
            
            const resetUrl = `${url}/user/account/change-password?token=${resetToken}`;

            const html = `
                <h1>FixOra Password Reset Request</h1>
                <p>You have requested to reset your password. If you did not make this request, please ignore this email — no action will be taken.</p>
                <br />
                <p>To reset your password, please click the link below:</p>
                <p>${resetUrl}</p>
                <br />
                <p><strong>Note:</strong> This link is valid for a limited time. Please complete the reset process before it expires.</p>
            `;
            
            await this.emailService.sendEmail(user.email, "FixOra Reset Password", html); 

        } catch (error :any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}