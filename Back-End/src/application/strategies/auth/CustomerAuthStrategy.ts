import { User } from "../../../domain/entities/UserEntity.js";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { IHashService } from "../../../domain/interface/ServiceInterface/IHashService.js";
import { HttpStatusCode } from "../../../shared/constant/HttpStatusCode.js";
import { Messages } from "../../../shared/constant/Messages.js";
import { RoleEnum } from "../../../shared/constant/Roles.js";
import { SigninDTO } from "../../DTO's/SigninDTO.js";
import { AuthData, IAuthStrategy } from "../../Interface/strategies/auth/IAuthStrategy.js";

const { FORBIDDEN, INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INVALID_CREDENTIALS, INTERNAL_ERROR,ACCOUNT_BLOCKED } = Messages;


export class CustomerAuthStrategy  implements IAuthStrategy  {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly hashService: IHashService
    ) {}

    async authenticate(credentials: SigninDTO): Promise<AuthData> {
        
        try {
            const user = await this.userRepository.findByEmail(credentials.email) as User;

            if (!user || user.role != credentials.role ) throw { status: FORBIDDEN, message: INVALID_CREDENTIALS };
            if (user.isBlocked) throw { status: FORBIDDEN, message: ACCOUNT_BLOCKED  };

            const isMatch = await this.hashService.compare(credentials.password, user.password as string );
            if (!isMatch) throw { status: FORBIDDEN, message: INVALID_CREDENTIALS };
            
            return { userData: user, role: RoleEnum.Customer };
            
        } catch (error:any ) {
            if (error.status && error.message) throw error;

            throw {
                status: INTERNAL_SERVER_ERROR,
                message: INTERNAL_ERROR
            };
        }
    }
}