
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken'
import type { SignOptions } from 'jsonwebtoken';

import { IOtpRepository } from "../../../domain/interface/RepositoryInterface/IOtpRepository.js";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { IEmailService } from "../../../domain/interface/ServiceInterface/IEmailService.js";
import { SignupDTO } from "../../DTO's/AuthDTO/SignupDTO.js";
import { IOtpGenratorService } from "../../../domain/interface/ServiceInterface/IOtpGeneratorService.js";
import { IHashService } from "../../../domain/interface/ServiceInterface/IHashService.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";
import { ISignupUseCase } from "../../Interface/useCases/Auth/ISignupUseCase.js";

const { CONFLICT, INTERNAL_SERVER_ERROR} = HttpStatusCode
const { EMAIL_ALREADY_EXISTS, INTERNAL_ERROR } = Messages

export class SignupUseCase implements ISignupUseCase{
    constructor(
        private readonly _userRepository : IUserRepository,
        private readonly _otpRepository: IOtpRepository ,
        private readonly _emailService: IEmailService,
        private readonly _otpGenratorService: IOtpGenratorService,
        private readonly _hashService : IHashService
    ) {}
    
    async execute(userData: SignupDTO): Promise<string> {
        try {
            const existingUser = await this._userRepository.findByEmail(userData.email)
            if (existingUser) {
                throw { status: CONFLICT, message: EMAIL_ALREADY_EXISTS }; 
            }

            const hashedPassword = await this._hashService.hash(userData.password)
            
            const tempPayload = {
                ...userData,
                password: hashedPassword,
                userId: uuidv4(),
            }
            
            // src/config.ts
            const expiryTime  = process.env.JWT_TEMP_ACCESS_TOKEN_EXPIRY as SignOptions['expiresIn']
            const tempToken = jwt.sign(tempPayload, process.env.JWT_TEMP_ACCESS_SECRET as string, { expiresIn: expiryTime })

            const otp = this._otpGenratorService.generateOtp()
            console.log("This is the Otp", otp)
            
            await this._otpRepository.storeOtp({
                email: userData.email,
                otp,
                createdAt: new Date()
            })

            const html = `<h1>Welcome to FixOra</h1><p>Your OTP code is: <strong>${otp}</strong></p>`
            await this._emailService.sendEmail(userData.email, "Your FixOra OTP", html);

            return tempToken

        } catch (error: any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }

}