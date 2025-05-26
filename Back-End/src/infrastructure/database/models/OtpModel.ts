import mongoose, { Document } from 'mongoose'
import { Otp } from '../../../domain/entities/OtpEntity.js'

export interface IOtpModel extends Document, Otp {}


const  otpSchema= new mongoose.Schema<IOtpModel>({
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

    createdAt :{
        type : Date,
        default : Date.now ,
        expires: 300   // 60s * 5 = 300 sec ie = 5 minute 
    },
},)

const OtpModel = mongoose.model<IOtpModel>('Otp',otpSchema)

export default OtpModel


