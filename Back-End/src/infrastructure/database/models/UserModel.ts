import mongoose, { Document } from 'mongoose'
import { User } from '../../../domain/entities/UserEntity.js'
import { RoleEnum } from '../../../shared/constant/Roles.js'

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
    geo: {  // this was implimented to impliment the near by filter logic
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],  // [longitude, latitude]
            default: [0, 0],
        },
    },
},{ _id: false });

const userSchema = new mongoose.Schema<IUserModel>({
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
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
    googleId: {
        type: String,
        unique: true,
        sparse: true,
        index: true
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
    {
        timestamps: true,
    },
)
userSchema.index({ "location.geo": "2dsphere" });
const UserModel = mongoose.model<IUserModel>('User', userSchema)

export default UserModel