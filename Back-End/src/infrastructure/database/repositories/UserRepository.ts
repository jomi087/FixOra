//domain + useCase connected to db => IUserRepository + email/user(parmeter came form usecase) connecting to mongo db (for comunication) via infrasturcture

import { User } from "../../../domain/entities/UserEntity.js";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import UserModel from "../models/UserModel.js";

export class UserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<User | null>{
        return await UserModel.findOne({ email })  //mongo db methods 
    }

    async create(user: User): Promise<void>{
        const newUser = new  UserModel(user)
        await newUser.save()
    }

}



