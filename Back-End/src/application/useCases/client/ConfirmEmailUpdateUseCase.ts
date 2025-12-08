
import { IOtpRepository } from "../../../domain/interface/RepositoryInterface/IOtpRepository";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { EmailUpdateVerfifyOTPInputDTO } from "../../DTOs/EditProfileDTO";
import { IConfirmEmailUpdateUseCase } from "../../Interface/useCases/Client/IConfirmEmailUpdateUseCase";

const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INVALID_OTP, OTP_EXPIRED, INTERNAL_ERROR } = Messages;

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
                throw { status: BAD_REQUEST, message: OTP_EXPIRED };
            } else if (storedOtp.otp != otp) {
                throw { status: BAD_REQUEST, message: INVALID_OTP };
            }
            console.log("newEmail", newEmail);
            await this._otpRepository.deleteOtpByEmail(currentEmail);

            await this._userRepository.updateEmail(userId, newEmail);

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}