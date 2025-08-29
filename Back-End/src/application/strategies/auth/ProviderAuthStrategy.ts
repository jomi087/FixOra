import { User } from "../../../domain/entities/UserEntity";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { IHashService } from "../../../domain/interface/ServiceInterface/IHashService";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/Messages";
import { RoleEnum } from "../../../shared/Enums/Roles";
import { SigninInputDTO } from "../../DTO's/AuthDTO/SigninDTO";
import { AuthData, IAuthStrategy } from "../../Interface/strategies/auth/IAuthStrategy";


const { FORBIDDEN, INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INVALID_CREDENTIALS, INTERNAL_ERROR,ACCOUNT_BLOCKED } = Messages;

export class ProviderAuthStrategy  implements IAuthStrategy  {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _hashService: IHashService,
        // private readonly providerRepository: IProviderRepository,
    ) {}

    async authenticate(credentials: SigninInputDTO): Promise<AuthData> {
        try {
            const user = await this._userRepository.findByEmail(credentials.email) as User;

            if (!user || user.role != RoleEnum.Provider ) throw { status: FORBIDDEN, message: INVALID_CREDENTIALS };;
            if (user.isBlocked) throw  { status: FORBIDDEN, message: ACCOUNT_BLOCKED  };

            const isMatch = await this._hashService.compare(credentials.password, user.password as string );
            if (!isMatch) throw { status: FORBIDDEN, message: INVALID_CREDENTIALS };
            
            return { userData: user, role: RoleEnum.Provider };
            
        } catch (error:any ) {
            if (error.status && error.message) throw error;

            throw {
                status: INTERNAL_SERVER_ERROR,
                message: INTERNAL_ERROR
            };
        }
    }
}