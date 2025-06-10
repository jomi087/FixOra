import { User } from "../../entities/UserEntity.js";

export interface IUserRepository {
    findByEmail(email: string): Promise <User | null>;
    create(user: User): Promise <void>;
    findByUserId(userId: string): Promise<Omit<User, "password" | "refreshToken"> | null>;
    update(userId:string , updates: Partial<User>) :Promise<Omit <User, "password"|"refreshToken" > | null>
 }



