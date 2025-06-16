import jwt from "jsonwebtoken";
import { IOtpRepository } from "../../domain/interface/RepositoryInterface/IOtpRepository.js";
import { IUserRepository } from "../../domain/interface/RepositoryInterface/IUserRepository.js";
import {  OtpVerifyDTO } from "../dtos/OtpVerifyDTO.js";
import { UserDTO } from "../dtos/UserDTO.js";
import { RoleEnum } from "../../domain/constant/Roles.js";


export class VerifyAcUseCase{
    constructor(
        private readonly otpRepository: IOtpRepository ,
        private readonly userRepository : IUserRepository,
    ) { }

    async execute(otpData: OtpVerifyDTO , token : string) {
        try {
            
            if (!token) {
                throw { status: 403, message: "Something  went wrong"  }
            }
            
            const decodeUserData  = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as UserDTO            
            const storedOtp = await this.otpRepository.findOtpByEmail(decodeUserData.email)
            if ( !storedOtp ) {
                throw { status: 400, message: "OTP Expired, Click Re-Send Otp" }
            }else if (storedOtp.otp != otpData.otp) {
                throw { status: 400, message: "Invalid OTP" }
            }

            await this.userRepository.create({
                ...decodeUserData,
                createdAt: new Date(),
                role : RoleEnum.Customer
            })

            await this.otpRepository.deleteOtpByEmail(decodeUserData.email)

            return {
                success: true,
                message: "Account Created SuccessFully"
            };

        } catch (error: any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: 500, message: "Account Verification failed, (something went wrong)" };
        }
    }
    
}


    