import { Otp } from "../../../domain/entities/OtpEntity";
import { IOtpRepository } from "../../../domain/interface/RepositoryInterface/IOtpRepository";
import OtpModel from "../models/OtpModel";

export class OtpRepository implements IOtpRepository {
    async storeOtp(otp:Otp) : Promise<void>{
        await OtpModel.findOneAndUpdate(
            { email: otp.email },
            { otp: otp.otp , createdAt: new Date() },
            {upsert  : true }
        )
    }

    async findOtpByEmail(email : string):Promise<Otp|null> {
        return await OtpModel.findOne({email})
    }

    async deleteOtpByEmail(email:string):Promise<void> {
        await OtpModel.deleteOne({ email })
    }

    

}
