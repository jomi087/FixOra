import { User } from "../../../../domain/entities/UserEntity";
import { IUserRepository } from "../../../../domain/interface/repositoryInterface/IUserRepository";
import { IHashService } from "../../../../domain/interface/serviceInterface/IHashService";
import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../../shared/const/Messages";
import { RoleEnum } from "../../../../shared/enums/Roles";
import { SigninInputDTO } from "../../../dtos/AuthDTO/SigninDTO";
import { AuthData, IAuthStrategy } from "../../../interface/strategies/auth/IAuthStrategy";
import { AppError } from "../../../../shared/errors/AppError";

const { FORBIDDEN } = HttpStatusCode;
const { INVALID_CREDENTIALS } = Messages;

export class AdminAuthStrategy implements IAuthStrategy {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _hashService: IHashService
    ) { }

    async authenticate(credentials: SigninInputDTO): Promise<AuthData> {

        try {
            const user = await this._userRepository.findByEmail(credentials.email) as User;

            if (!user || user.role != credentials.role || user.role != RoleEnum.Admin) throw new AppError(FORBIDDEN, INVALID_CREDENTIALS);

            const isMatch = await this._hashService.compare(credentials.password, user.password as string);
            if (!isMatch) throw new AppError(FORBIDDEN, INVALID_CREDENTIALS);
            return { userData: user, role: RoleEnum.Admin };

        } catch (error:unknown) {
            throw error;
        }
    }
}