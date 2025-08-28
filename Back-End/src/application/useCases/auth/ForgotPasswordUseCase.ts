

import jwt from "jsonwebtoken";
import type { SignOptions } from 'jsonwebtoken';

import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { IEmailService } from "../../../domain/interface/ServiceInterface/IEmailService";
import { Messages } from "../../../shared/Messages";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { IForgotPasswordUseCase } from "../../Interface/useCases/Auth/IForgotPasswordUseCase";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode
const { INTERNAL_ERROR, EMAIL_NOT_FOUND  } = Messages

export class ForgotPasswordUseCase implements IForgotPasswordUseCase{
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _emailService: IEmailService
    ) { }
    
    async execute(email: string): Promise<void>{
        try {
            if (!(await this._userRepository.findByEmail(email, ['password', 'refreshToken',]))) {
                throw { status : NOT_FOUND , message : EMAIL_NOT_FOUND }
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
            
            await this._emailService.sendEmail(email, "FixOra Reset Password", html);

        } catch (error :any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}