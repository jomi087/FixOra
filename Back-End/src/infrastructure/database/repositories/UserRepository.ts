import { User } from "../../../domain/entities/UserEntity.js";
import { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import UserModel from "../models/UserModel.js";

export class UserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<User | null>{
        return await UserModel.findOne({ email })  //mongo db methods 
    }

    async create(user: User): Promise<User>{
        const newUser = new  UserModel(user)
        return await newUser.save()
    }

    
}