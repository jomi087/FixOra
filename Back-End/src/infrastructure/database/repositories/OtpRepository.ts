import { Otp } from "../../../domain/entities/OtpEntity.js";
import { IOtpRepository } from "../../../domain/interface/RepositoryInterface/IOtpRepository.js";
import OtpModel from "../models/OtpModel.js";

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
