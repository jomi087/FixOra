import jwt from "jsonwebtoken";
import { DecodedUserDTO  } from "../../DTOs/AuthDTO/DecodedUserDTO";
import { IOtpRepository } from "../../../domain/interface/RepositoryInterface/IOtpRepository";
import { IOtpGenratorService } from "../../../domain/interface/ServiceInterface/IOtpGeneratorService";
import { IEmailService } from "../../../domain/interface/ServiceInterface/IEmailService";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { IResendOtpUseCase } from "../../Interface/useCases/Auth/IResendOtpUseCase";

const { FORBIDDEN,INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { UNAUTHORIZED_MSG,INTERNAL_ERROR } = Messages;

export class ResendOtpUseCase implements IResendOtpUseCase{
    constructor(
        private readonly _otpRepository: IOtpRepository,
        private readonly _otpGenratorService: IOtpGenratorService,
        private readonly _emailService: IEmailService,
        
    ) { }
    
    async execute(token : string):Promise<void> {
        try {
            if (!token) {
                throw { status: FORBIDDEN , message: UNAUTHORIZED_MSG };
            }
            const decodeUserData  = jwt.verify( token, process.env.JWT_TEMP_ACCESS_SECRET as string ) as DecodedUserDTO;             
            
            const otp = this._otpGenratorService.generateOtp();
            console.log("this._is resend otp", otp);
            
            await this._otpRepository.storeOtp({
                email: decodeUserData.email,
                otp,
                createdAt: new Date()
            });

            const html = `<h1>Welcome to FixOra</h1><p>Your OTP code is: <strong>${otp}</strong></p>`;
            await this._emailService.sendEmail(decodeUserData.email, "Your FixOra OTP", html);

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };  
        }
    }
}