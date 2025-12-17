
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

import { IOtpRepository } from "../../../domain/interface/RepositoryInterface/IOtpRepository";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { IEmailService } from "../../../domain/interface/ServiceInterface/IEmailService";
import { SignupDTO } from "../../dtos/AuthDTO/SignupDTO";
import { IOtpGenratorService } from "../../../domain/interface/ServiceInterface/IOtpGeneratorService";
import { IHashService } from "../../../domain/interface/ServiceInterface/IHashService";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { ISignupUseCase } from "../../Interface/useCases/Auth/ISignupUseCase";
import { AppError } from "../../../shared/errors/AppError";

const { CONFLICT } = HttpStatusCode;
const { EMAIL_ALREADY_EXISTS } = Messages;

export class SignupUseCase implements ISignupUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _otpRepository: IOtpRepository,
        private readonly _emailService: IEmailService,
        private readonly _otpGenratorService: IOtpGenratorService,
        private readonly _hashService: IHashService
    ) { }

    async execute(userData: SignupDTO): Promise<string> {
        try {
            const existingUser = await this._userRepository.findByEmail(userData.email);
            if (existingUser) {
                throw new AppError(CONFLICT,EMAIL_ALREADY_EXISTS);
            }

            const hashedPassword = await this._hashService.hash(userData.password);

            const tempPayload = {
                ...userData,
                password: hashedPassword,
                userId: uuidv4(),
            };

            const expiryTime = process.env.JWT_TEMP_ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"];
            const tempToken = jwt.sign(tempPayload, process.env.JWT_TEMP_ACCESS_SECRET as string, { expiresIn: expiryTime });

            const otp = this._otpGenratorService.generateOtp();
            console.log("This is the signup Otp", otp);

            await this._otpRepository.storeOtp({
                email: userData.email,
                otp,
                createdAt: new Date()
            });

            const html = `<h1>Welcome to FixOra</h1><p>Your OTP code is: <strong>${otp}</strong></p>`;
            await this._emailService.sendEmail(userData.email, "Your FixOra OTP", html);

            return tempToken;

        } catch (error: unknown) {
            throw error;
        }
    }

}