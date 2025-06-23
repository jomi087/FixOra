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

    async create(user: User): Promise<User>{
        const newUser = new  UserModel(user)
        return await newUser.save() as unknown as User
    }

    async findByUserId(userId: string, omitFields:Array<keyof User>=[]): Promise<Partial<User>| null>{
        const omitSelect = omitFields.map(field => `-${field}`).join(' ')
        return await UserModel.findOne({ userId }).select(omitSelect).lean<Partial<User>>()
    }

    async findByUserGoogleId(googleId: string, omitFields:Array<keyof User>=[]): Promise<Partial<User>| null>{
        const omitSelect = omitFields.map(field => `-${field}`).join(' ')
        return await UserModel.findOne({ googleId }).select(omitSelect).lean<Partial<User>>()
    }

    async update( filter: Partial<Pick<User, "email" | "userId" | "googleId" >> , updates: Partial<User>,  omitFields:Array<keyof User>=[]): Promise<Partial<User>| null>{
        const omitSelect = omitFields.map(field => `-${field}`).join(' ')
        return await UserModel.findOneAndUpdate(
            filter,
            { $set: updates },
            { new: true }
        ).select(omitSelect).lean<Partial<User>>()
    }
}



