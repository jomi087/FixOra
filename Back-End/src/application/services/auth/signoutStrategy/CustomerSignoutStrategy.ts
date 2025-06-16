import { IUserRepository } from "../../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { ISignoutStrategy } from "./interface/ISignoutStrategy.js";

export class CustomerSignoutStrategy implements ISignoutStrategy {
    constructor(
        private readonly userRepository: IUserRepository,        
    ) { }
    
    async signout(userId: string): Promise<void> {
        try {
            if (!(await this.userRepository.update(userId, { refreshToken: "" }))) {
                throw { status: 400, message: "User not found during signout" };
            }
        } catch (error : any ) {
            if (error.status && error.message) throw error;
            throw {
                status: 500,
                message: "something went wrong ( CustomerSignoutStrategy error )"
            };
        }
    }
} 