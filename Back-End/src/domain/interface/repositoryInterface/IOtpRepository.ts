import { Otp } from "../../entities/OtpEntity";


export interface IOtpRepository{

    storeOtp(otp: Otp): Promise<void>;
    findOtpByEmail(email: string): Promise< Otp | null>
    deleteOtpByEmail(email: string): Promise<void>
    
}
