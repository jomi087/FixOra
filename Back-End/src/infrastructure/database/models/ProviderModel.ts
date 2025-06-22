import mongoose, { Document, Schema } from 'mongoose';
import { Provider } from '../../../domain/entities/ProviderEntity.js';
import { KYCStatus } from '../../../domain/constant/KYCstatus.js';

// Extend Document with Provider
export interface IProviderModel extends Document, Provider {}

const providerSchema = new Schema<IProviderModel>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },

    kyc: {
      idCard: {
        type: String,
        required: true,
        trim: true,
      },
      certificate: {
        education: {
          type: String,
          required: true,
          trim: true,
        },
        experience: {
          type: String,
          trim: true,
        },
      },
    },

    serviceCharge: {
      type: Number,
      required: true,
    },
    kycInfo: {
      status: {
        type: String,
        enum: Object.values(KYCStatus),
        default: KYCStatus.Pending,
      },
      reason: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

const ProviderModel = mongoose.model<IProviderModel>('Provider', providerSchema);

export default ProviderModel;
