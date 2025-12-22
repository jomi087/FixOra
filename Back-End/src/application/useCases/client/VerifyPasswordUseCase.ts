import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import { User } from "../../../domain/entities/UserEntity";
import { IHashService } from "../../../domain/interface/serviceInterface/IHashService";
import { IEmailService } from "../../../domain/interface/serviceInterface/IEmailService";
import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { IVerifyPasswordUseCase } from "../../Interface/useCases/clientTemp/IVerifyPasswordUseCase";
import { buildResetPasswordEmail } from "../../services/emailTemplates/resetPasswordTemplate";
import { BRAND } from "../../../shared/const/constants";
import { AppError } from "../../../shared/errors/AppError";

const { FORBIDDEN } = HttpStatusCode;
const { INVALID_PASSWORD } = Messages;

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
            if (!isMatch) throw new AppError(FORBIDDEN, INVALID_PASSWORD);

            const expiryTime = process.env.JWT_TEMP_RESET_TOKEN_EXPIRY as SignOptions["expiresIn"];
            const resetToken = jwt.sign({ email: user.email }, process.env.JWT_RESET_PASSWORD_SECRET as string, { expiresIn: expiryTime });

            const url = BRAND.FRONTEND_URL;

            const resetUrl = `${url}/${user.role}/change-password?token=${resetToken}`;
            // const resetUrl = `${url}/customer/account/profile/change-password?token=${resetToken}`;

            const html = buildResetPasswordEmail({ resetUrl });

            await this._emailService.sendEmail(user.email, "FixOra Reset Password", html);

        } catch (error: unknown) {
            throw error;
        }
    }
}