import { Otp } from "../../../domain/entities/OtpEntity.js";
import { IOtpRepository } from "../../../domain/interface/RepositoryInterface/IOtpRepository.js";
import OtpModel, { IOtpModel } from "../models/OtpModel.js";

export class OtpRepository implements IOtpRepository {
    async storeOtp(otp:Otp) : Promise<void>{
        await OtpModel.findOneAndUpdate(
            { email: otp.email },
            { otp: otp.otp },
            {upsert  : true , setDefaultsOnInsert : true }
        )
    }

    async findOtpByEmail(email : string):Promise<IOtpModel|null> {
        return await OtpModel.findOne({email})
    }

    async deleteOtpByEmail(email:string):Promise<void> {
        await OtpModel.deleteOne({ email })
    }

    

}
