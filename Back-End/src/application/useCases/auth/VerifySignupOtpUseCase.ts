import jwt from "jsonwebtoken";
import { IOtpRepository } from "../../../domain/interface/RepositoryInterface/IOtpRepository.js";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { UserInputDTO } from "../../DTO's/UserInputDTO.js";
import { RoleEnum } from "../../../shared/constant/Roles.js";
import { HttpStatusCode } from "../../../shared/constant/HttpStatusCode.js";
import { Messages } from "../../../shared/constant/Messages.js";

const { FORBIDDEN,BAD_REQUEST, INTERNAL_SERVER_ERROR} = HttpStatusCode
const { UNAUTHORIZED_MSG, INVALID_OTP, OTP_EXPIRED, INTERNAL_ERROR } = Messages

export class VerifySignupOtpUseCase{
    constructor(
        private readonly otpRepository: IOtpRepository ,
        private readonly userRepository : IUserRepository,
    ) { }

    async execute(otpData: string , token : string):Promise<void> {
        try {
            if (!token) {
                throw { status: FORBIDDEN, message: UNAUTHORIZED_MSG  }
            }
            
            const decodeUserData = jwt.verify(token, process.env.JWT_TEMP_ACCESS_SECRET as string) as UserInputDTO
            
            const storedOtp = await this.otpRepository.findOtpByEmail(decodeUserData.email)
            if ( !storedOtp ) {
                throw { status: BAD_REQUEST, message: OTP_EXPIRED }
            } else if (storedOtp.otp != otpData ) {
                throw { status: BAD_REQUEST, message: INVALID_OTP  }
            }
            console.log("decodeUserData",decodeUserData)
            await this.userRepository.create({
                ...decodeUserData,
                role: RoleEnum.Customer,
            }) 

            await this.otpRepository.deleteOtpByEmail(decodeUserData.email)

        } catch (error: any) {
            console.log(error)
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
    
}


    