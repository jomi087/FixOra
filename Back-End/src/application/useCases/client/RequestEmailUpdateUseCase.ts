import { IOtpRepository } from "../../../domain/interface/RepositoryInterface/IOtpRepository";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { IEmailService } from "../../../domain/interface/ServiceInterface/IEmailService";
import { IOtpGenratorService } from "../../../domain/interface/ServiceInterface/IOtpGeneratorService";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { NewEmailRequestInputDTO } from "../../DTOs/EditProfileDTO";
import { IRequestEmailUpdateUseCase } from "../../Interface/useCases/Client/IRequestEmailUpdateUseCase";
import { commonOtpEmail } from "../../services/emailTemplates/commonOtpTemplate";

const { CONFLICT } = HttpStatusCode;
const { EMAIL_ALREADY_EXISTS } = Messages;

export class RequestEmailUpdateUseCase implements IRequestEmailUpdateUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _otpGenratorService: IOtpGenratorService,
        private readonly _otpRepository: IOtpRepository,
        private readonly _emailService: IEmailService,
    ) { }

    async execute(input: NewEmailRequestInputDTO): Promise<void> {
        const { currentEmail, newEmail } = input;
        try {
            const existingUser = await this._userRepository.findByEmail(newEmail);
            if (existingUser) {
                throw new AppError(CONFLICT, EMAIL_ALREADY_EXISTS);
            }

            const otp = this._otpGenratorService.generateOtp();
            console.log("This is the email updated Otp", otp);

            await this._otpRepository.storeOtp({
                email: currentEmail,
                otp,
                createdAt: new Date()
            });

            const html = commonOtpEmail({ otp, description: "Email updation request" });
            await this._emailService.sendEmail(currentEmail, "FixOra OTP", html);

        } catch (error: unknown) {
            throw error;
        }
    }
}