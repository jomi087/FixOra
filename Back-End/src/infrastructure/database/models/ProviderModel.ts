import mongoose, { Document, Schema } from 'mongoose';
import { Provider } from '../../../domain/entities/ProviderEntity.js';
import { KYCStatus } from '../../../shared/constant/KYCstatus.js';
import { Gender } from '../../../shared/constant/Gender.js';

// Extend Document with Provider
export interface IProviderModel extends Document, Provider {}

const providerSchema = new Schema<IProviderModel>({
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    dob: {
      type: Date, 
      required : true,
    },
    gender: {
        type: String,
        enum: Object.values(Gender),
        required: true,
    },
    serviceId: {
      type: String,
      required: true,
    },
    specializationIds : [{
      type: String,
      required: true,
    }],
    profileImage: {
      type: String,
      required : true
    },
    serviceCharge: {
      type: Number,
      required: true,
    },
    kyc: {
        idCard: {
            type: String,
            required: true,
        },
        certificate: {
            education: {
                type: String,
                required: true,
            },
            experience: {
                type: String,
            },
        },
    },
    isOnline : {
        type: Boolean,
        default : false
    }
}, {
    timestamps: true,
    }
);

const ProviderModel = mongoose.model<IProviderModel>('Provider', providerSchema);

export default ProviderModel;
