import { Schema ,Document,model } from "mongoose";
import { KYCRequest } from "../../../domain/entities/KYCRequestEntity";
import { KYCStatus } from "../../../shared/enumss/KYCstatus";
import { Gender } from "../../../shared/enumss/Gender";

export interface IKYCRequestModel extends Document,KYCRequest{}

const KYCRequestSchema = new Schema<IKYCRequestModel>({
    userId: {
        type: String,
        unique : true,
        required: true
    },
    dob: {
        type: Date,
        required : true
    },
    gender: {
        type: String,
        enum: Object.values(Gender),
        required: true,

    },
    serviceId: {
        type: String,
        // unique: true,
        required : true
    },
    specializationIds: [{
        type: String,
        required : true        
    }],
    profileImage: {
        type: String,
        required : true
    },
    serviceCharge: {
        type: Number,
        required : true
    },
    kyc: {
        idCard: {
            type: String,
            required : true
        },
        certificate: {
            education: {
                type: String,
                required : true
            },
            experience: {
                type: String,
            }
        },
    },
    status: {
        type: String,
        enum: Object.values(KYCStatus),
        default: KYCStatus.Pending,
    },
    reason: {
        type: String,
    },
    submittedAt: {
        type: Date,
        default : Date.now
    },
    reviewedAt: {
        type : Date
    },
    reviewedBy: {
        type : String
    }
}, { timestamps: true });

const KYCRequestModel = model<IKYCRequestModel>("KYCRequest", KYCRequestSchema);

export default KYCRequestModel;