import { RoleEnum } from "../../../../domain/constant/Roles.js";
import { User } from "../../../../domain/entities/UserEntity.js";
import { IUserRepository } from "../../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { IHashService } from "../../../../domain/interface/ServiceInterface/IHashService.js";
import { SigninDTO } from "../../../dtos/SigninDTO.js";
import { AuthData, IAuthStrategy } from "./interface/IAuthStrategy.js";



export class CustomerAuthStrategy  implements IAuthStrategy  {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly hashService: IHashService
    ) {}

    async authenticate(credentials: SigninDTO): Promise<AuthData> {
        
        try {
            const user = await this.userRepository.findByEmail(credentials.email) as User;

            if (!user || user.role != credentials.role ) throw { status: 401, message: "Invalid credentials" };
            if (user.isBlocked) throw { status: 403, message: "Account blocked" };

            const isMatch = await this.hashService.compare(credentials.password, user.password );
            if (!isMatch) throw { status: 401, message: "Invalid credentials" };
            
            return { userData: user, role: RoleEnum.Customer };
            
        } catch (error:any ) {
            if (error.status && error.message) throw error;

            throw {
                status: 500,
                message: "something went wrong ( CustomerAuthStrategy error )"
            };
        }
    }
}