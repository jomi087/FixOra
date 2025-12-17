

import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { IEmailService } from "../../../domain/interface/serviceInterface/IEmailService";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { IForgotPasswordUseCase } from "../../Interface/useCases/auth/IForgotPasswordUseCase";
import { buildResetPasswordEmail } from "../../services/emailTemplates/resetPasswordTemplate";
import { BRAND } from "../../../shared/const/constants";
import { AppError } from "../../../shared/errors/AppError";

const {  NOT_FOUND } = HttpStatusCode;
const {  NOT_FOUND_MSG } = Messages;

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _emailService: IEmailService
    ) { }

    async execute(email: string): Promise<void> {
        try {
            if (!(await this._userRepository.findByEmail(email, ["password", "refreshToken",]))) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Email"));
            }

            const expiryTime = process.env.JWT_TEMP_RESET_TOKEN_EXPIRY as SignOptions["expiresIn"];
            const resetToken = jwt.sign({ email: email }, process.env.JWT_RESET_PASSWORD_SECRET as string, { expiresIn: expiryTime });

            const url = BRAND.FRONTEND_URL;

            const resetUrl = `${url}/reset-password?token=${resetToken}`;

            const html = buildResetPasswordEmail({ resetUrl });

            await this._emailService.sendEmail(email, "FixOra Reset Password", html);

        } catch (error: unknown) {
            throw error;
        }
    }
}