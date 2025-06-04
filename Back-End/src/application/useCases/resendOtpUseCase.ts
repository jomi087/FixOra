import jwt from "jsonwebtoken";
import { UserDTO } from "../dtos/UserDTO.js";
import { IOtpRepository } from "../../domain/interface/RepositoryInterface/IOtpRepository.js";
import { IOtpGenratorService } from "../../domain/interface/ServiceInterface/IOtpGeneratorService.js";
import { IEmailService } from "../../domain/interface/ServiceInterface/IEmailService.js";


export class ResendOtpUseCase{
    constructor(
        private readonly otpRepository: IOtpRepository,
        private readonly otpGenratorService: IOtpGenratorService,
        private readonly emailService: IEmailService,
        
    ) { }
    
    async execute(token : string) {
        try {

            if (!token) {
                throw { status: 401, message: "Something  went wrong"  }
            }
            
            const decodeUserData  = jwt.verify(token, process.env.JWT_SECRET as string) as UserDTO            
            
            const otp = this.otpGenratorService.generateOtp()

            await this.otpRepository.storeOtp({
                email: decodeUserData.email,
                otp,
                createdAt: new Date()
            })

            const html = `<h1>Welcome to FixOra</h1><p>Your OTP code is: <strong>${otp}</strong></p>`
            await this.emailService.sendEmail(decodeUserData.email, "Your FixOra OTP", html);

            return {
                success: true,
                message: "OTP sent to your email",
            };

        } catch (error:any) {
           if (error.status && error.message) {
               throw error;
            }
            throw { status: 500, message: "Re-send Otp failed, please try again." };  
        }
    }
}