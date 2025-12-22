import { v4 as uuidv4 } from "uuid";
import { RoleEnum } from "../../../shared/enums/Roles";
import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { GoogleOAuthService } from "../../../infrastructure/services/GoogleOAuthService";
import { ITokenService } from "../../../domain/interface/serviceInterface/ITokenService";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { IGoogleSigninUseCase } from "../../interfacetemp/useCases/auth/IGoogleSigninUseCase";
import { SignInOutputDTO } from "../../dtos/AuthDTO/SigninDTO";
import { AppError } from "../../../shared/errors/AppError";

const { NOT_FOUND, FORBIDDEN } = HttpStatusCode;
const { NOT_FOUND_MSG, ACCOUNT_BLOCKED } = Messages;

export class GoogleSigninUseCase implements IGoogleSigninUseCase {
    constructor(
        private readonly _googleOAuthService: GoogleOAuthService,
        private readonly _userRepository: IUserRepository,
        private readonly _tokenService: ITokenService,
    ) { }

    async execute(code: string, role: RoleEnum): Promise<SignInOutputDTO> {
        try {
            const tokenResponse = await this._googleOAuthService.exchangeCodeForToken(code);
            const googleUser = await this._googleOAuthService.getUserInfo(tokenResponse.access_token);

            let user = await this._userRepository.findByUserGoogleId(googleUser.sub);

            if (!user) {
                user = await this._userRepository.create({
                    userId: uuidv4(),
                    fname: googleUser.given_name,
                    lname: googleUser.family_name,
                    email: googleUser.email,
                    googleId: googleUser.sub,
                    isBlocked: false,
                    role,
                });
            }
            if (user.isBlocked) throw new AppError(FORBIDDEN, ACCOUNT_BLOCKED);


            const payload = {
                id: user.userId,
                email: user.email,
                role: role
            };

            const acsToken = this._tokenService.generateAccessToken(payload);
            const refToken = this._tokenService.generateRefreshToken(payload);

            const updatedUserData = await this._userRepository.updateRefreshTokenAndGetUser(user.userId, refToken);
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
