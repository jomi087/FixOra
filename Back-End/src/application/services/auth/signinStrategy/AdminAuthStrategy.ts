import { RoleEnum } from "../../../../shared/constant/Roles.js";
import { User } from "../../../../domain/entities/UserEntity.js";
import { IUserRepository } from "../../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { IHashService } from "../../../../domain/interface/ServiceInterface/IHashService.js";
import { SigninDTO } from "../../../dtos/SigninDTO.js";
import { AuthData, IAuthStrategy } from "./interface/IAuthStrategy.js";



export class AdminAuthStrategy  implements IAuthStrategy  {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly hashService: IHashService
    ) {}

    async authenticate(credentials: SigninDTO): Promise<AuthData> {
        
        try {
            const user = await this.userRepository.findByEmail(credentials.email) as User;

            if (!user || user.role != credentials.role ||  user.role != RoleEnum.Admin  ) throw { status: 403, message: "Invalid credentials" };
            const isMatch = await this.hashService.compare(credentials.password, user.password as string );
            if (!isMatch) throw { status: 403, message: "Invalid credentials" };
            
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