import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { ITokenService } from "../../../domain/interface/serviceInterface/ITokenService";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { IRefreshTokenUseCase } from "../../Interface/useCases/auth/IRefreshTokenUseCase";
import { AppError } from "../../../shared/errors/AppError";


const { FORBIDDEN, NOT_FOUND } = HttpStatusCode;
const { UNAUTHORIZED_MSG, INVALID_REFRESH_TOKEN, NOT_FOUND_MSG } = Messages;

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    constructor(
        private readonly _tokenService: ITokenService,
        private readonly _userRepository: IUserRepository
    ) { }

    async execute(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
        try {
            if (!refreshToken) {
                throw new AppError(FORBIDDEN, "Session expired. Please login again.", UNAUTHORIZED_MSG);
            }

            const decoded = this._tokenService.verifyRefreshToken(refreshToken) as {
                id: string;
                name: string;
                email: string;
                role: string;
            };

            const user = await this._userRepository.findByUserId(decoded?.id, ["password"]);
            if (!user || user.refreshToken !== refreshToken) {
                throw new AppError(FORBIDDEN, "Session expired. Please login again.", INVALID_REFRESH_TOKEN);
            }

            const payload = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
                name: decoded.name,
            };

            const newAccessToken = this._tokenService.generateAccessToken(payload);
            const newRefreshToken = this._tokenService.generateRefreshToken(payload);

            if (!await this._userRepository.resetRefreshTokenById(decoded.id, newRefreshToken)) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("User"));
            }

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };

        } catch (error: unknown) {
            throw error;
        }
    }
}
