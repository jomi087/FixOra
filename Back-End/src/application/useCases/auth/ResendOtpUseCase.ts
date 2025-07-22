import jwt from "jsonwebtoken";
import { UserInputDTO } from "../../DTO's/UserInputDTO.js";
import { IOtpRepository } from "../../../domain/interface/RepositoryInterface/IOtpRepository.js";
import { IOtpGenratorService } from "../../../domain/interface/ServiceInterface/IOtpGeneratorService.js";
import { IEmailService } from "../../../domain/interface/ServiceInterface/IEmailService.js";
import { HttpStatusCode } from "../../../shared/constant/HttpStatusCode.js";
import { Messages } from "../../../shared/constant/Messages.js";

const {FORBIDDEN,INTERNAL_SERVER_ERROR} = HttpStatusCode
const {UNAUTHORIZED_MSG,INTERNAL_ERROR} = Messages

export class ResendOtpUseCase{
    constructor(
        private readonly otpRepository: IOtpRepository,
        private readonly otpGenratorService: IOtpGenratorService,
        private readonly emailService: IEmailService,
        
    ) { }
    
    async execute(token : string):Promise<void> {
        try {
            if (!token) {
                throw { status: FORBIDDEN , message: UNAUTHORIZED_MSG }
            }
            const decodeUserData  = jwt.verify( token, process.env.JWT_TEMP_ACCESS_SECRET as string ) as UserInputDTO            
            
            const otp = this.otpGenratorService.generateOtp()
            console.log("this is resend otp", otp)
            
            await this.otpRepository.storeOtp({
                email: decodeUserData.email,
                otp,
                createdAt: new Date()
            })

            const html = `<h1>Welcome to FixOra</h1><p>Your OTP code is: <strong>${otp}</strong></p>`
            await this.emailService.sendEmail(decodeUserData.email, "Your FixOra OTP", html);

        } catch (error:any) {
           if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };  
        }
    }
}