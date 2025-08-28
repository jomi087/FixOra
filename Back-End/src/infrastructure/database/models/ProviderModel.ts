import mongoose, { Document, Schema } from 'mongoose';
import { Provider } from '../../../domain/entities/ProviderEntity';
import { KYCStatus } from '../../../shared/Enums/KYCstatus';
import { Gender } from '../../../shared/Enums/Gender';

// Extend Document with Provider
export interface IProviderModel extends Document, Provider {}

const providerSchema = new Schema<IProviderModel>({
  providerId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
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
    min: [300, 'Service charge must be at least 300'],
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
  },
}, {
    timestamps: true,
  }
);

const ProviderModel = mongoose.model<IProviderModel>('Provider', providerSchema);

export default ProviderModel;
