import { v4 as uuidv4 } from "uuid";
import { RoleEnum } from "../../../shared/Enums/Roles.js";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { GoogleOAuthService } from "../../../infrastructure/services/GoogleOAuthService.js";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ITokenService.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";

const { INTERNAL_SERVER_ERROR, NOT_FOUND,FORBIDDEN } = HttpStatusCode
const { INTERNAL_ERROR, USER_NOT_FOUND, ACCOUNT_BLOCKED } = Messages

export class GoogleSigninUseCase {
    constructor(
        private readonly googleOAuthService: GoogleOAuthService,
        private readonly userRepository : IUserRepository,
        private readonly tokenService: ITokenService,
    ) { }

    async execute(code : string , role : RoleEnum) {
        try {
            const tokenResponse = await this.googleOAuthService.exchangeCodeForToken(code)
            const googleUser = await this.googleOAuthService.getUserInfo(tokenResponse.access_token)
            
            let user = await this.userRepository.findByUserGoogleId(googleUser.sub)

            if (!user) {
                user = await this.userRepository.create({
                    userId: uuidv4(),
                    fname: googleUser.given_name,
                    lname: googleUser.family_name,
                    email: googleUser.email,
                    googleId: googleUser.sub,
                    role,
                })
            }
            if (user.isBlocked) throw { status: FORBIDDEN, message: ACCOUNT_BLOCKED };

            const payload = {
                id: user.userId,
                email: user.email,
                role: role
            }

            const acsToken = this.tokenService.generateAccessToken(payload)
            const refToken = this.tokenService.generateRefreshToken(payload)

            const updatedUserData = await this.userRepository.update({ userId: user.userId }, { refreshToken: refToken }, ["password", "refreshToken"])
            if (!updatedUserData) {
                throw { status: NOT_FOUND, message: USER_NOT_FOUND };
            } 

            return {
                userData: {
                    fname: updatedUserData.fname,
                    lname: updatedUserData.lname,
                    email: updatedUserData.email,
                    mobileNo: updatedUserData.mobileNo,
                    role: updatedUserData.role,
                    location : updatedUserData.location

                },
                accessToken: acsToken,
                refreshToken: refToken,
            };
        } catch (error:any) {
            if (error.status && error.message) {
               throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}
