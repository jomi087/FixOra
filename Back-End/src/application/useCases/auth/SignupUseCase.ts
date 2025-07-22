
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken'
import type { SignOptions } from 'jsonwebtoken';

import { IOtpRepository } from "../../../domain/interface/RepositoryInterface/IOtpRepository.js";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { IEmailService } from "../../../domain/interface/ServiceInterface/IEmailService.js";
import { SignupDTO } from "../../DTO's/SignupDTO.js";
import { IOtpGenratorService } from "../../../domain/interface/ServiceInterface/IOtpGeneratorService.js";
import { IHashService } from "../../../domain/interface/ServiceInterface/IHashService.js";
import { HttpStatusCode } from "../../../shared/constant/HttpStatusCode.js";
import { Messages } from "../../../shared/constant/Messages.js";

const { CONFLICT, INTERNAL_SERVER_ERROR} = HttpStatusCode
const { EMAIL_ALREADY_EXISTS, INTERNAL_ERROR } = Messages

export class SignupUseCase {
    constructor(
        private readonly userRepository : IUserRepository,
        private readonly otpRepository: IOtpRepository ,
        private readonly emailService: IEmailService,
        private readonly otpGenratorService: IOtpGenratorService,
        private readonly hashService : IHashService
    ) {}
    
    async execute(userData: SignupDTO) {
        try {
            const existingUser = await this.userRepository.findByEmail(userData.email)
            if (existingUser) {
                throw { status: CONFLICT, message: EMAIL_ALREADY_EXISTS }; 
            }

            const hashedPassword = await this.hashService.hash(userData.password)
            
            const tempPayload = {
                ...userData,
                password: hashedPassword,
                userId: uuidv4(),
            }
            
            // src/config.ts
            const expiryTime  = process.env.JWT_TEMP_ACCESS_TOKEN_EXPIRY as SignOptions['expiresIn']
            const tempToken = jwt.sign(tempPayload, process.env.JWT_TEMP_ACCESS_SECRET as string, { expiresIn: expiryTime })

            const otp = this.otpGenratorService.generateOtp()
            console.log("This is the Otp", otp)
            
            await this.otpRepository.storeOtp({
                email: userData.email,
                otp,
                createdAt: new Date()
            })

            const html = `<h1>Welcome to FixOra</h1><p>Your OTP code is: <strong>${otp}</strong></p>`
            await this.emailService.sendEmail(userData.email, "Your FixOra OTP", html);

            return tempToken

        } catch (error: any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }

}