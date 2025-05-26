import { User } from "../entities/UserEntity.js";

export interface IUserRepository {
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;

}








