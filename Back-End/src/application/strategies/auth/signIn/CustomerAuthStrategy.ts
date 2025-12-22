import { User } from "../../../../domain/entities/UserEntity";
import { IUserRepository } from "../../../../domain/interface/repositoryInterface/IUserRepository";
import { IHashService } from "../../../../domain/interface/serviceInterface/IHashService";
import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../../shared/const/Messages";
import { RoleEnum } from "../../../../shared/enums/Roles";
import { SigninInputDTO } from "../../../dto/auth/SigninDTO";
import { AuthData, IAuthStrategy } from "../../../interface/strategies/auth/IAuthStrategy";
import { AppError } from "../../../../shared/errors/AppError";

const { FORBIDDEN } = HttpStatusCode;
const { INVALID_CREDENTIALS, ACCOUNT_BLOCKED } = Messages;


export class CustomerAuthStrategy implements IAuthStrategy {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _hashService: IHashService
    ) { }

    async authenticate(credentials: SigninInputDTO): Promise<AuthData> {

        try {
            const user = await this._userRepository.findByEmail(credentials.email) as User;

            if (!user || user.role != credentials.role) throw new AppError(FORBIDDEN, INVALID_CREDENTIALS);
            if (user.isBlocked) throw new AppError(FORBIDDEN, ACCOUNT_BLOCKED);

            const isMatch = await this._hashService.compare(credentials.password, user.password as string);
            if (!isMatch) throw new AppError(FORBIDDEN, INVALID_CREDENTIALS, "Wrong Password");

            return { userData: user, role: RoleEnum.Customer };

        } catch (error: unknown) {
            throw error;
        }
    }
}