import jwt from "jsonwebtoken";
import { IOtpRepository } from "../../../domain/interface/RepositoryInterface/IOtpRepository";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { DecodedUserDTO  } from "../../DTO's/AuthDTO/DecodedUserDTO";
import { RoleEnum } from "../../../shared/Enums/Roles";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/Messages";
import { IVerifySignupOtpUseCase } from "../../Interface/useCases/Auth/IVerifySignupOtpUseCase";

const { FORBIDDEN,BAD_REQUEST, INTERNAL_SERVER_ERROR} = HttpStatusCode
const { UNAUTHORIZED_MSG, INVALID_OTP, OTP_EXPIRED, INTERNAL_ERROR } = Messages

export class VerifySignupOtpUseCase implements IVerifySignupOtpUseCase{
    constructor(
        private readonly _otpRepository: IOtpRepository ,
        private readonly _userRepository : IUserRepository,
    ) { }

    async execute(otpData: string , token : string):Promise<void> {
        try {
            if (!token) {
                throw { status: FORBIDDEN, message: UNAUTHORIZED_MSG  }
            }
            
            const decodeUserData = jwt.verify(token, process.env.JWT_TEMP_ACCESS_SECRET as string) as DecodedUserDTO 
            
            const storedOtp = await this._otpRepository.findOtpByEmail(decodeUserData.email)
            if ( !storedOtp ) {
                throw { status: BAD_REQUEST, message: OTP_EXPIRED }
            } else if (storedOtp.otp != otpData ) {
                throw { status: BAD_REQUEST, message: INVALID_OTP  }
            }
            console.log("decodeUserData",decodeUserData)
            await this._userRepository.create({
                ...decodeUserData,
                isBlocked: false,
                
                role: RoleEnum.Customer,
            }) 

            await this._otpRepository.deleteOtpByEmail(decodeUserData.email)

        } catch (error: any) {
            console.log(error)
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
    
}


    