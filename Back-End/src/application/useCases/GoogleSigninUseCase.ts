import { v4 as uuidv4 } from "uuid";
import { RoleEnum } from "../../shared/constant/Roles.js";
import { IUserRepository } from "../../domain/interface/RepositoryInterface/IUserRepository.js";
import { GoogleOAuthService } from "../../infrastructure/services/GoogleOAuthService.js";
import { ITokenService } from "../../domain/interface/ServiceInterface/ITokenService.js";

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

            const payload = {
                id: user.userId,
                email: user.email,
                role: role
            }

            const acsToken = this.tokenService.generateAccessToken(payload)
            const refToken = this.tokenService.generateRefreshToken(payload)

            const updatedUserData = await this.userRepository.update({ userId: user.userId }, { refreshToken: refToken }, ["password", "refreshToken"])
            if (!updatedUserData) {
                throw { status: 404, message: "User Not Found" };
            } 

            return {
                success: true,
                message : "Singin Successful",
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
            throw { status: 500, message: 'signin failed ( something went wrong )'};
        }
    }
}
