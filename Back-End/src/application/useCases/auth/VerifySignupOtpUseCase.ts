import jwt from "jsonwebtoken";
import { IOtpRepository } from "../../../domain/interface/repositoryInterface/IOtpRepository";
import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { DecodedUserDTO } from "../../dtos/AuthDTO/DecodedUserDTO";
import { RoleEnum } from "../../../shared/enums/Roles";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { IVerifySignupOtpUseCase } from "../../interface/useCases/auth/IVerifySignupOtpUseCase";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IWalletRepository";
import { AppError } from "../../../shared/errors/AppError";

const { FORBIDDEN, BAD_REQUEST } = HttpStatusCode;
const { MISSING_TOKEN, INVALID_OTP, OTP_EXPIRED } = Messages;

export class VerifySignupOtpUseCase implements IVerifySignupOtpUseCase {
    constructor(
        private readonly _otpRepository: IOtpRepository,
        private readonly _userRepository: IUserRepository,
        private readonly _walletRepository: IWalletRepository

    ) { }

    async execute(otpData: string, token: string): Promise<void> {
        try {
            if (!token) {
                throw new AppError(FORBIDDEN, "Session expired, Please Sign-up again", MISSING_TOKEN("Sign-up"));
            }

            const decodeUserData = jwt.verify(token, process.env.JWT_TEMP_ACCESS_SECRET as string) as DecodedUserDTO;

            const storedOtp = await this._otpRepository.findOtpByEmail(decodeUserData.email);
            if (!storedOtp) {
                throw new AppError(BAD_REQUEST, OTP_EXPIRED);
            } else if (storedOtp.otp != otpData) {
                throw new AppError(BAD_REQUEST, INVALID_OTP);

            }

            const user = await this._userRepository.create({
                ...decodeUserData,
                isBlocked: false,
                role: RoleEnum.Customer,
            });

            try {
                await this._walletRepository.create({
                    userId: user.userId,
                    balance: 0,
                    transactions: [],
                    createdAt: new Date(),
                });
            } catch (walletError) {
                await this._userRepository.delete(user.userId);
                throw walletError || "wallet creation issue spoted";
            }

            await this._otpRepository.deleteOtpByEmail(decodeUserData.email);


        } catch (error: unknown) {
            throw error;
        }
    }

}


