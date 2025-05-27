import { IOtpModel } from "../../../infrastructure/database/models/OtpModel.js";
import { Otp } from "../../entities/OtpEntity.js";


export interface IOtpRepository{

    storeOtp(otp: Otp): Promise<void>;
    findOtpByEmail(email: string): Promise< IOtpModel | null>
    deleteOtpByEmail(email: string): Promise<void>
    
}
