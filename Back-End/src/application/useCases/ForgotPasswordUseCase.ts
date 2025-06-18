

import jwt from "jsonwebtoken";
import type { SignOptions } from 'jsonwebtoken';

import { IUserRepository } from "../../domain/interface/RepositoryInterface/IUserRepository.js";
import { IEmailService } from "../../domain/interface/ServiceInterface/IEmailService.js";

export class ForgotPasswordUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly emailService: IEmailService
        
    ) { }
    
    async execute(email: string) {
        try {
            if (!(await this.userRepository.findByEmail(email, ['password', 'refreshToken',]))) {
                throw { status : 404, message : "Email doesn’t exist" }
            }

            const expiryTime  = process.env.JWT_TEMP_RESET_TOKEN_EXPIRY as SignOptions['expiresIn']
            const resetToken = jwt.sign({email : email}, process.env.JWT_RESET_PASSWORD_SECRET  as string, { expiresIn: expiryTime })

            const url = process.env.FRONTEND_URL || 'http://localhost:5001'
            
            const resetUrl = `${url}/reset-password?token=${resetToken}`;


            const html = `
                <h1>FixOra Password Reset Request</h1>
                <p>You have requested to reset your password. If you did not make this request, please ignore this email — no action will be taken.</p>
                <br />
                <p>To reset your password, please click the link below:</p>
                <p>${resetUrl}</p>
                <br />
                <p><strong>Note:</strong> This link is valid for a limited time. Please complete the reset process before it expires.</p>
            `;
            
            await this.emailService.sendEmail(email, "FixOra Reset Password", html);

            return {
                success: true,
                message : "Verification mail sent to your mail"
            }
        } catch (error :any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: 500, message: 'email verification failed, (something went wrong)'};
        }
    }
}