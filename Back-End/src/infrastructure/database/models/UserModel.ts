import mongoose, { Document } from 'mongoose'
import { User } from '../../../domain/entities/UserEntity.js'

export interface IUserModel extends Document, User {}


const userSchema = new mongoose.Schema<IUserModel>({
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true
        //default: '',
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
    isBlocked: {
        type: Boolean,
        required: true,
        default : false
    },
    isVerified: {
        type: Boolean,
        required: true,
        default : false
    }
},
    {timestamps : true}
)

const UserModel = mongoose.model<IUserModel>('User', userSchema)

export default UserModel