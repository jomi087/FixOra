import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ITokenService.js";
import { HttpStatusCode } from "../../../shared/constant/HttpStatusCode.js";
import { Messages } from "../../../shared/constant/Messages.js";


const { FORBIDDEN,NOT_FOUND } = HttpStatusCode
const { UNAUTHORIZED_MSG,INVALID_REFRESH_TOKEN,USER_NOT_FOUND } = Messages

export class RefreshTokenUseCase  {
  constructor(
    private readonly tokenService: ITokenService ,
    private readonly userRepository : IUserRepository
  ) { }

  async execute(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw { status: FORBIDDEN,  message: UNAUTHORIZED_MSG  }
      }

      const decoded = this.tokenService.verifyRefreshToken(refreshToken) as {
        id: string;
        name: string;
        email: string;
        role: string;
      };

      const user = await this.userRepository.findByUserId(decoded?.id,["password"])
      if (!user || user.refreshToken !== refreshToken  ) {
        throw { status: FORBIDDEN, message: INVALID_REFRESH_TOKEN };
      }

      const payload = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
      }

      const newAccessToken = this.tokenService.generateAccessToken(payload);
      const newRefreshToken = this.tokenService.generateRefreshToken(payload)
      
      if (!await this.userRepository.update( { userId: decoded.id } ,{refreshToken : newRefreshToken } )) {
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
