import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ITokenService.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";
import { SigninDTO } from "../../DTO's/SigninDTO.js";
import { AuthStrategyFactory } from "../../strategies/auth/AuthStrategyFactory.js";

const {NOT_FOUND,INTERNAL_SERVER_ERROR} = HttpStatusCode
const { USER_NOT_FOUND, INTERNAL_ERROR } = Messages

export class SigninUseCase {
    constructor(
        private readonly authFactory: AuthStrategyFactory,
        private readonly tokenService: ITokenService,
        private readonly userRepository : IUserRepository,
    ) {}

    async execute(credentials: SigninDTO) {
        try {
            // here i could had added if else way or switch way(show below ) but the issue is that then  i am violationg the OCP (open/close priciple  [must be open for extention and close for modification] in solid in fiture if there is more role comming then i dont need to modify signin logic jst d )
            // a Role Strategy Map — dynamic role-to-strategy resolution.
            
            //from here
            const strategy = this.authFactory.getStrategy(credentials.role);
            const authenticatedUser = await strategy.authenticate(credentials);
            //till here 
            const { userData, role } = authenticatedUser

            const payload = {
                id: userData.userId,
                email : userData.email,
                role: role
            }
            const acsToken  = this.tokenService.generateAccessToken(payload)
            const refToken = this.tokenService.generateRefreshToken(payload)
            
            const updatedUserData = await this.userRepository.update({ userId: userData.userId } ,{refreshToken : refToken } ,["password","refreshToken"])
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

//to avoid this i dont dynamic role base stratergy
// if (credentials.role == 'customer') {
//     check
//     userdata is there in  user collection db
//     user is  bloked or not 
//     userData. role === customer
//     check pasword
// } else if (credentials.role == 'provider') {
//     check
//     providerdata is there in provider collection db
//     proivder is  bloked or not
//     providerdata.role === proivder
//     provider  verification status === verified
//     check pasword
// } else if (credentials.role == "admin") {
//     check
//     admindata is there in admin collection db
//     admindata.role === admin
//     check pasword
// }
