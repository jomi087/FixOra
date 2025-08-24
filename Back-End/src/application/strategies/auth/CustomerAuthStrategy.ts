import { User } from "../../../domain/entities/UserEntity.js";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { IHashService } from "../../../domain/interface/ServiceInterface/IHashService.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";
import { RoleEnum } from "../../../shared/Enums/Roles.js";
import { SigninInputDTO } from "../../DTO's/AuthDTO/SigninDTO.js";
import { AuthData, IAuthStrategy } from "../../Interface/strategies/auth/IAuthStrategy.js";

const { FORBIDDEN, INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INVALID_CREDENTIALS, INTERNAL_ERROR,ACCOUNT_BLOCKED } = Messages;


export class CustomerAuthStrategy  implements IAuthStrategy  {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _hashService: IHashService
    ) {}

    async authenticate(credentials: SigninInputDTO): Promise<AuthData> {
        
        try {
            const user = await this._userRepository.findByEmail(credentials.email) as User;

            if (!user || user.role != credentials.role ) throw { status: FORBIDDEN, message: INVALID_CREDENTIALS };
            if (user.isBlocked) throw { status: FORBIDDEN, message: ACCOUNT_BLOCKED  };

            const isMatch = await this._hashService.compare(credentials.password, user.password as string );
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