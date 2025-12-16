import { IOtpRepository } from "../../../domain/interface/RepositoryInterface/IOtpRepository";
import { IOtpGenratorService } from "../../../domain/interface/ServiceInterface/IOtpGeneratorService";
import { IEmailService } from "../../../domain/interface/ServiceInterface/IEmailService";
import { IResendOtpUseCase } from "../../Interface/useCases/Auth/IResendOtpUseCase";
import { commonOtpEmail } from "../../services/emailTemplates/commonOtpTemplate";


export class ResendOtpUseCase implements IResendOtpUseCase {
    constructor(
        private readonly _otpRepository: IOtpRepository,
        private readonly _otpGenratorService: IOtpGenratorService,
        private readonly _emailService: IEmailService,

    ) { }

    async execute(email: string): Promise<void> {
        try {

            const otp = this._otpGenratorService.generateOtp();
            console.log("this._is resend otp", otp);

            await this._otpRepository.storeOtp({
                email: email,
                otp,
                createdAt: new Date()
            });

            const html = commonOtpEmail({ otp, description: "Re-send Otp request" });
            await this._emailService.sendEmail(email, "FixOra OTP", html);

        } catch (error: unknown) {
            throw error;
        }
    }
}