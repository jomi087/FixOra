import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { ITokenService } from "../../../domain/interface/serviceInterface/ITokenService";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { SigninInputDTO, SignInOutputDTO } from "../../dto/auth/SigninDTO";
import { ISigninUseCase } from "../../interface/useCases/auth/ISigninUseCase";
import { AuthStrategyFactory } from "../../strategies/auth/signIn/AuthStrategyFactory";
import { AppError } from "../../../shared/errors/AppError";

const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;

export class SigninUseCase implements ISigninUseCase {
    constructor(
        private readonly _authFactory: AuthStrategyFactory,
        private readonly _tokenService: ITokenService,
        private readonly _userRepository: IUserRepository,
    ) { }

    async execute(credentials: SigninInputDTO): Promise<SignInOutputDTO> {
        try {
            const strategy = this._authFactory.getStrategy(credentials.role);
            const authenticatedUser = await strategy.authenticate(credentials);
            const { userData, role } = authenticatedUser;

            const payload = {
                id: userData.userId,
                email: userData.email,
                role: role
            };

            const acsToken = this._tokenService.generateAccessToken(payload);
            const refToken = this._tokenService.generateRefreshToken(payload);

            const updatedUserData = await this._userRepository.updateRefreshTokenAndGetUser(userData.userId, refToken);
            if (!updatedUserData) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("User"));
            }

            let mappedupdatedUserData = {
                userData: {
                    userId: updatedUserData.userId,
                    fname: updatedUserData.fname,
                    lname: updatedUserData.lname,
                    email: updatedUserData.email,
                    mobileNo: updatedUserData.mobileNo,
                    role: updatedUserData.role,
                    location: updatedUserData.location,
                },
                accessToken: acsToken,
                refreshToken: refToken,
            };

            return mappedupdatedUserData;

        } catch (error: unknown) {
            throw error;
        }
    }
}
