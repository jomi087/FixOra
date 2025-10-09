import { User } from "../../../domain/entities/UserEntity";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { IHashService } from "../../../domain/interface/ServiceInterface/IHashService";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { RoleEnum } from "../../../shared/enums/Roles";
import { SigninInputDTO } from "../../DTOs/AuthDTO/SigninDTO";
import { AuthData, IAuthStrategy } from "../../Interface/strategies/auth/IAuthStrategy";

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
            
        } catch (error) {
            if (error.status && error.message) throw error;

            throw {
                status: INTERNAL_SERVER_ERROR,
                message: INTERNAL_ERROR
            };
        }
    }
}