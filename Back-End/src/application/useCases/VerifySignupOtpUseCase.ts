import jwt from "jsonwebtoken";
import { IOtpRepository } from "../../domain/interface/RepositoryInterface/IOtpRepository.js";
import { IUserRepository } from "../../domain/interface/RepositoryInterface/IUserRepository.js";
import { UserInputDTO } from "../InputDTO's/UserInputDTO.js";
import { RoleEnum } from "../../shared/constant/Roles.js";
import { UserDTO } from "../../domain/outputDTO's/UserDTO.js";


export class VerifySignupOtpUseCase{
    constructor(
        private readonly otpRepository: IOtpRepository ,
        private readonly userRepository : IUserRepository,
    ) { }

    async execute(otpData: string , token : string):Promise<void> {
        try {
            
            if (!token) {
                throw { status: 403, message: "Something  went wrong"  }
            }
            
            const decodeUserData = jwt.verify(token, process.env.JWT_TEMP_ACCESS_SECRET as string) as UserInputDTO
            const storedOtp = await this.otpRepository.findOtpByEmail(decodeUserData.email)
            if ( !storedOtp ) {
                throw { status: 400, message: "OTP Expired, Click Re-Send Otp" }
            } else if (storedOtp.otp != otpData ) {
                throw { status: 400, message: "Invalid OTP" }
            }

            await this.userRepository.create({
                ...decodeUserData,
                role: RoleEnum.Customer,
            }) 

            await this.otpRepository.deleteOtpByEmail(decodeUserData.email)

        } catch (error: any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: 500, message: "Account Verification failed, (something went wrong)" };
        }
    }
    
}


    