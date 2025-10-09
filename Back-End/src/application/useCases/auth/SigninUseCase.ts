import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ITokenService";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { SigninInputDTO, SignInOutputDTO } from "../../DTO's/AuthDTO/SigninDTO";
import { ISigninUseCase } from "../../Interface/useCases/Auth/ISigninUseCase";
import { AuthStrategyFactory } from "../../strategies/auth/AuthStrategyFactory";

const { NOT_FOUND,INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { USER_NOT_FOUND, INTERNAL_ERROR } = Messages;

export class SigninUseCase implements ISigninUseCase {
    constructor(
        private readonly _authFactory: AuthStrategyFactory,
        private readonly _tokenService: ITokenService,
        private readonly _userRepository : IUserRepository,
    ) {}

    async execute(credentials: SigninInputDTO): Promise<SignInOutputDTO>{
        try {
            // here i could had added if else way or switch way(show below ) but the issue is that then  i am violationg the OCP (open/close priciple  [must be open for extention and close for modification] in solid in fiture if there is more role comming then i dont need to modify signin logic jst d )
            // a Role Strategy Map — dynamic role-to-strategy resolution.
            
            //from here
            const strategy = this._authFactory.getStrategy(credentials.role);
            const authenticatedUser = await strategy.authenticate(credentials);
            //till here 
            const { userData, role } = authenticatedUser; 

            const payload = {
                id: userData.userId,
                email : userData.email,
                role: role
            };

            const acsToken  = this._tokenService.generateAccessToken(payload);
            const refToken = this._tokenService.generateRefreshToken(payload);
            
            const updatedUserData = await this._userRepository.updateRefreshTokenAndGetUser( userData.userId, refToken );
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

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}

//to avoid this._i dont dynamic role base stratergy
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
