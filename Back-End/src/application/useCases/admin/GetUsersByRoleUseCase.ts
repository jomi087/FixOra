import { RoleEnum } from "../../../domain/constant/Roles.js";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";

export class GetUsersByRoleUseCase{
    constructor(
        private readonly userRepository : IUserRepository,

    ) {}
    
    async execute(role: RoleEnum) {
        
        try {
            const usersData = await this.userRepository.findByRole(role, ['password', 'refreshToken', 'googleId', 'userId','updatedAt'])
            console.log(usersData,"usersData")
            return {
                success: true,
                usersData
            };
        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: 500, message: 'Fetching Customer data failed, (something went wrong)'};
        }
    }
}