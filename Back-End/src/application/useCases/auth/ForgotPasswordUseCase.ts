

import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { IEmailService } from "../../../domain/interface/ServiceInterface/IEmailService";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { IForgotPasswordUseCase } from "../../Interface/useCases/Auth/IForgotPasswordUseCase";
import { buildResetPasswordEmail } from "../../services/emailTemplates/resetPasswordTemplate";
import { BRAND } from "../../../shared/const/constants";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, EMAIL_NOT_FOUND } = Messages;

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _emailService: IEmailService
    ) { }

    async execute(email: string): Promise<void> {
        try {
            if (!(await this._userRepository.findByEmail(email, ["password", "refreshToken",]))) {
                throw { status: NOT_FOUND, message: EMAIL_NOT_FOUND };
            }

            const expiryTime = process.env.JWT_TEMP_RESET_TOKEN_EXPIRY as SignOptions["expiresIn"];
            const resetToken = jwt.sign({ email: email }, process.env.JWT_RESET_PASSWORD_SECRET as string, { expiresIn: expiryTime });

            const url = BRAND.FRONTEND_URL;

            const resetUrl = `${url}/reset-password?token=${resetToken}`;

            const html = buildResetPasswordEmail({ resetUrl });

            await this._emailService.sendEmail(email, "FixOra Reset Password", html);

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}