import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ITokenService";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { IRefreshTokenUseCase } from "../../Interface/useCases/Auth/IRefreshTokenUseCase";


const { FORBIDDEN,NOT_FOUND } = HttpStatusCode;
const { UNAUTHORIZED_MSG,INVALID_REFRESH_TOKEN,USER_NOT_FOUND } = Messages;

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    constructor(
    private readonly _tokenService: ITokenService ,
    private readonly _userRepository : IUserRepository
    ) {}

    async execute(refreshToken: string): Promise<{ accessToken:string, refreshToken:string}>{
        try {
            if (!refreshToken) {
                throw { status: FORBIDDEN,  message: UNAUTHORIZED_MSG  };
            }

            const decoded = this._tokenService.verifyRefreshToken(refreshToken) as {
        id: string;
        name: string;
        email: string;
        role: string;
      };

            const user = await this._userRepository.findByUserId(decoded?.id,["password"]);
            if (!user || user.refreshToken !== refreshToken  ) {
                throw { status: FORBIDDEN, message: INVALID_REFRESH_TOKEN };
            }

            const payload = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
                name: decoded.name,
            };

            const newAccessToken = this._tokenService.generateAccessToken(payload);
            const newRefreshToken = this._tokenService.generateRefreshToken(payload);
      
            if (!await this._userRepository.resetRefreshTokenById( decoded.id, newRefreshToken )) {
                throw { status: NOT_FOUND, message: USER_NOT_FOUND };
            }

            return  {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };

        } catch (error:any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: FORBIDDEN, message: UNAUTHORIZED_MSG };
        }
    }
}
