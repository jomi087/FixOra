import { User } from "../../entities/UserEntity.js";

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<void>;
}








