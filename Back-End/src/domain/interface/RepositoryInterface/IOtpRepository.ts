import { Otp } from "../../entities/OtpEntity.js";


export interface IOtpRepository{

    storeOtp(otp: Otp): Promise<void>;
    findOtpByEmail(email: string): Promise< Otp | null>
    deleteOtpByEmail(email: string): Promise<void>
    
}
