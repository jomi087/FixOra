// Infrastructure talking to MongoDB using the IUserRepository interface.
// Parameters like email/userId come from the use case layer.
import { User } from "../../../domain/entities/UserEntity.js";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import UserModel from "../models/UserModel.js";

export class UserRepository implements IUserRepository {
    async findByEmail(email: string, omitFields:Array<keyof User>=[]): Promise<Partial<User>| null>{
        const omitSelect = omitFields.map(field => `-${field}`).join(' ')
        return await UserModel.findOne({ email }).select(omitSelect).lean<Partial<User>>()  //mongo db methods 
    }

    async create(user: User): Promise<void>{
        const newUser = new  UserModel(user)
        await newUser.save()
    }

    async findByUserId(userId: string, omitFields:Array<keyof User>=[]): Promise<Partial<User>| null>{
        const omitSelect = omitFields.map(field => `-${field}`).join(' ')
        return await UserModel.findOne({ userId }).select(omitSelect).lean<Partial<User>>()
    }

    async update(userId: string, updates: Partial<User>,  omitFields:Array<keyof User>=[]): Promise<Partial<User>| null>{
        const omitSelect = omitFields.map(field => `-${field}`).join(' ')
        return await UserModel.findOneAndUpdate(
            { userId },
            { $set: updates },
            { new: true }
        ).select(omitSelect).lean<Partial<User>>()
    }
}



