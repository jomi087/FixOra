import mongoose, { Document } from 'mongoose'
import { User } from '../../../domain/entities/UserEntity.js'
import { RoleEnum } from '../../../domain/constant/Roles.js'

export interface IUserModel extends Document, User {}


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
        required: true,
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
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
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
    }
},
    {timestamps : true}
)

const UserModel = mongoose.model<IUserModel>('User', userSchema)

export default UserModel