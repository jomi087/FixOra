import { IUserRepository } from "../../domain/interface/RepositoryInterface/IUserRepository.js";
import { ITokenService } from "../../domain/interface/ServiceInterface/ITokenService.js";

export class RefreshTokenUseCase  {
  constructor(
    private readonly tokenService: ITokenService ,
    private readonly userRepository : IUserRepository
  ) { }

  async execute(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw { status: 403,  message: "Unauthorized request (refresh Token missing)"  }
      }

      const decoded = this.tokenService.verifyRefreshToken(refreshToken) as {
        id: string;
        name: string;
        email: string;
        role: string;
      };

      const user = await this.userRepository.findByUserId(decoded?.id,["password"])
      if (!user || user.refreshToken !== refreshToken  ) {
        throw { status: 403, message: "Invalid refresh token" };
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
          throw { status: 404, message: "User Not Found" };
      }

      return  {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };

    } catch (error:any) {
      if (error.status && error.message) {
        throw error;
      }
      throw { status: 403, message: "Unauthorized (something went wrong)" };
    }
  }
}
