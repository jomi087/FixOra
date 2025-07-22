// Infrastructure talking to MongoDB using the IUserRepository interface.
// Parameters like email/userId come from the use case layer.
import { RoleEnum } from "../../../shared/constant/Roles.js";
import { User } from "../../../domain/entities/UserEntity.js";
import { Provider } from "../../../domain/entities/ProviderEntity.js";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import UserModel from "../models/UserModel.js";
import { KYCStatus } from "../../../shared/constant/KYCstatus.js";
import { UserDTO } from "../../../domain/outputDTO's/UserDTO.js";

//!mistake in this repository (i have am violatin srp rule need to re-work) 
//split the logic into indivijual

export class UserRepository implements IUserRepository {
    async findByEmail(email: string, omitFields:Array<keyof User>=[]): Promise<Partial<User>| null>{
        const omitSelect = omitFields.map(field => `-${field}`).join(' ')
        return await UserModel.findOne({ email }).select(omitSelect).lean<Partial<User>>()  //mongo db methods 
    }

    async create(user: UserDTO): Promise<User>{
        const newUser = new UserModel(user)
        await newUser.save();
        return newUser.toObject() as User;
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

    async findUsersWithFilters(options: { searchQuery: string; filter: string },currentPage: number, limit: number, omitFields: Array<keyof User>=[]): Promise<{ data: Partial<User>[]; total: number }>{
        
        const { searchQuery, filter } = options
        const query: any = { role: RoleEnum.Customer };
        //if (searchQuery) { query.fname = { $regex: searchQuery, $options: "i" }; }

        if (searchQuery) {
            query.$or = [
                { fname: { $regex: searchQuery, $options: "i" } },
                { lname: { $regex: searchQuery, $options: "i" } },
            ];
        }

        if (filter === "blocked") {
            query.isBlocked = true
        } else if (filter === "unblocked") {
            query.isBlocked = false
        }
        
        const omitSelect = omitFields.map(field => `-${field}`).join(' ');

        const total = await UserModel.countDocuments(query);
        const users = await UserModel.find(query)
            .select(omitSelect)
            .skip((currentPage - 1) * limit)
            .limit(limit)
            .lean<Partial<User>[]>();

        return { data : users, total}
    };

    async findProvidersWithFilters(options: { searchQuery: string; filter: string }, currentPage: number, limit: number, omitFields: Array<keyof User | keyof Provider>=[]): Promise<{ data: Array<Partial<User> & Partial<Provider>>; total: number }> {
        
        const { searchQuery, filter } = options
        const query: any = {
            role: RoleEnum.Provider,
        };

        if (searchQuery) {
            query.$or = [
                { fname: { $regex: searchQuery, $options: "i" } },
                { lname: { $regex: searchQuery, $options: "i" } },
            ];
        }

        if (filter === "blocked") query.isBlocked = true;
        else if (filter === "unblocked") query.isBlocked = false;
        else if (filter === "online") query.isOnline = true;
        else if (filter === "offline") query.isOnline = false;

        const omitSelect = omitFields.map((field) => `-${field}`).join(" ");

        const total = await UserModel.countDocuments(query);
        const data = await UserModel.find(query)
            .select(omitSelect)
            .skip((currentPage - 1) * limit)
            .limit(limit)
            .lean<Array<Partial<User> & Partial<Provider>>>();

        return { data, total };
    }
}



