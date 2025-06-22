import mongoose, { Document } from 'mongoose'
import { User } from '../../../domain/entities/UserEntity.js'
import { RoleEnum } from '../../../domain/constant/Roles.js'

export interface IUserModel extends Document, User {}

const addressSchema = new mongoose.Schema({
  houseinfo: { type: String,  trim: true, default: "" },
  street: { type: String,  trim: true },
  district: { type: String,  trim: true },
  city: { type: String,  trim: true },
  locality: { type: String,  trim: true },
  state: { type: String,  trim: true },
  postalCode: { type: String,  trim: true },
  coordinates: {
    latitude: { type: Number},
    longitude: { type: Number },
  },
});


const userSchema = new mongoose.Schema<IUserModel>({
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    mobileNo: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: Object.values(RoleEnum),
        required: true
    },
    refreshToken: {
        type : String
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default : false
    },
    location: {
        type: addressSchema,
        default: undefined
    },
},
    {timestamps : true}
)

const UserModel = mongoose.model<IUserModel>('User', userSchema)

export default UserModel