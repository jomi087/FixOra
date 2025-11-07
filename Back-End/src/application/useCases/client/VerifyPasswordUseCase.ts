import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import { User } from "../../../domain/entities/UserEntity";
import { IHashService } from "../../../domain/interface/ServiceInterface/IHashService";
import { IEmailService } from "../../../domain/interface/ServiceInterface/IEmailService";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { IVerifyPasswordUseCase } from "../../Interface/useCases/Client/IVerifyPasswordUseCase";
import { buildResetPasswordEmail } from "../../services/emailTemplates/resetPasswordTemplate";
import { BRAND } from "../../../shared/const/constants";

const { FORBIDDEN, INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR, INVALID_PASSWORD } = Messages;

export class VerifyPasswordUseCase implements IVerifyPasswordUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _hashService: IHashService,
        private readonly _emailService: IEmailService
    ) { }

    async execute(password: string, userId: string): Promise<void> {
        try {
            const user = await this._userRepository.findByUserId(userId, ["refreshToken"]) as User;
            const isMatch = await this._hashService.compare(password, user.password as string);
            if (!isMatch) throw { status: FORBIDDEN, message: INVALID_PASSWORD };

            const expiryTime = process.env.JWT_TEMP_RESET_TOKEN_EXPIRY as SignOptions["expiresIn"];
            const resetToken = jwt.sign({ email: user.email }, process.env.JWT_RESET_PASSWORD_SECRET as string, { expiresIn: expiryTime });

            const url = BRAND.FRONTEND_URL;

            const resetUrl = `${url}/${user.role}/change-password?token=${resetToken}`;
            // const resetUrl = `${url}/customer/account/profile/change-password?token=${resetToken}`;

            const html = buildResetPasswordEmail({ resetUrl });

            await this._emailService.sendEmail(user.email, "FixOra Reset Password", html);

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}