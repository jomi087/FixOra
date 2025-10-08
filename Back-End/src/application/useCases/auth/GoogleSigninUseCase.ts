import { v4 as uuidv4 } from "uuid";
import { RoleEnum } from "../../../shared/Enums/Roles";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { GoogleOAuthService } from "../../../infrastructure/services/GoogleOAuthService";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ITokenService";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { IGoogleSigninUseCase } from "../../Interface/useCases/Auth/IGoogleSigninUseCase";
import { SignInOutputDTO } from "../../DTO's/AuthDTO/SigninDTO";

const { INTERNAL_SERVER_ERROR, NOT_FOUND, FORBIDDEN } = HttpStatusCode;
const { INTERNAL_ERROR, USER_NOT_FOUND, ACCOUNT_BLOCKED } = Messages;

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
            if (user.isBlocked) throw { status: FORBIDDEN, message: ACCOUNT_BLOCKED };

            const payload = {
                id: user.userId,
                email: user.email,
                role: role
            };

            const acsToken = this._tokenService.generateAccessToken(payload);
            const refToken = this._tokenService.generateRefreshToken(payload);

            const updatedUserData = await this._userRepository.updateRefreshTokenAndGetUser(user.userId, refToken);
            if (!updatedUserData) {
                throw { status: NOT_FOUND, message: USER_NOT_FOUND };
            }

            let mappedupdatedUserData = {
                userData: {
                    userid: updatedUserData.userId,
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
        } catch (error: any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}
