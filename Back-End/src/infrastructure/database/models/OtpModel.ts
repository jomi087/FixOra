import mongoose, { Document } from "mongoose";
import { Otp } from "../../../domain/entities/OtpEntity";

export interface IOtpModel extends Document, Otp { }


const otpSchema = new mongoose.Schema<IOtpModel>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    otp: {
        type: String,
        required: true
    },
    //MongoDB will delete the document 300 seconds after createdAt.
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300   // 60s * 5 = 300 sec ie = 5 minute  (fixed for all opt expirey)
    },
});

const OtpModel = mongoose.model<IOtpModel>("Otp", otpSchema);

export default OtpModel;

//better way to create and
// expiresAt: {
//     type: Date,
//     required: true,
//     index: { expires: 0 }, // Mongo automatically removes expired OTPs
// },
// cz the above line is hard coding ( expires: 300) the expiry time
//  and
// it will be same for all otp logic
// by this way
// expiresAt: {
//     type: Date,
//     required: true,
//     index: { expires: 0 }, // Mongo automatically removes expired OTPs
// },
//MongoDB will delete the document exactly at expiresAt.

//aslo  we have  freedome to  implement how much the expiry should be for each otp logic 
// eg - > expiresAt: new Date(Date.now() + 5 * 60 * 1000) 