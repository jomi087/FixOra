
import { IOtpRepository } from "../../../domain/interface/repositoryInterfaceTempName/IOtpRepository";
import { IUserRepository } from "../../../domain/interface/repositoryInterfaceTempName/IUserRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { EmailUpdateVerfifyOTPInputDTO } from "../../dtos/EditProfileDTO";
import { IConfirmEmailUpdateUseCase } from "../../Interface/useCases/client/IConfirmEmailUpdateUseCase";

const { BAD_REQUEST } = HttpStatusCode;
const { INVALID_OTP, OTP_EXPIRED } = Messages;

export class ConfirmEmailUpdateUseCase implements IConfirmEmailUpdateUseCase {
    constructor(
        private readonly _otpRepository: IOtpRepository,
        private readonly _userRepository: IUserRepository
    ) { }

    async execute(input: EmailUpdateVerfifyOTPInputDTO): Promise<void> {
        const { userId, otp, currentEmail, newEmail } = input;
        try {
            const storedOtp = await this._otpRepository.findOtpByEmail(currentEmail);
            if (!storedOtp) {
                throw new AppError(BAD_REQUEST, OTP_EXPIRED);

            } else if (storedOtp.otp != otp) {
                throw new AppError(BAD_REQUEST, INVALID_OTP);
            }
            
            await this._otpRepository.deleteOtpByEmail(currentEmail);

            await this._userRepository.updateEmail(userId, newEmail);

        } catch (error: unknown) {
            throw error;
        }
    }
}