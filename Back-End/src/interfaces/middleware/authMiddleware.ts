import { NextFunction, Request, Response } from "express";
import { ITokenService } from "../../domain/interface/serviceInterfaceTempName/ITokenService";
import { IUserRepository } from "../../domain/interface/repositoryInterfaceTempName/IUserRepository";
import { User } from "../../domain/entities/UserEntity";
import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";
import { Messages } from "../../shared/const/Messages";
import { RoleEnum } from "../../shared/enums/Roles";

const { UNAUTHORIZED } = HttpStatusCode;
const { TOKEN_EXPIRED,INVALID_TOKEN,NOT_FOUND_MSG,UNAUTHORIZED_MSG,ACCOUNT_BLOCKED,FORBIDDEN_MSG } = Messages;

// Extend Express Request type  
declare global {
    namespace Express {
        interface Request {
            user?: Partial<User>;
        }
    }
}

export class AuthMiddleware {  //verify Jwt
    constructor(
        private _tokenService: ITokenService,
        private _userRepository: IUserRepository
    ) {}

    handle(requiredRoles?: RoleEnum[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
                if (!token) {
                    res.status(UNAUTHORIZED).json({
                        message: UNAUTHORIZED_MSG,
                    });
                    return;
                }

                const decode = this._tokenService.verifyAccessToken(token) as { id: string, email: string, role: RoleEnum };
            
                //my understanding no need to pass whole data userId is enouf (if still required the role and id) 
                const user = await this._userRepository.findByUserId(decode.id, ["password", "refreshToken"]);
                
                if (!user || !user.userId) {
                    res.status(UNAUTHORIZED).json({ message: NOT_FOUND_MSG("User") });
                    return;
                }

                const options = {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax" as const
                };

                if (user.isBlocked) {
                    res.clearCookie("accessToken", options);
                    res.clearCookie("refreshToken", options);
                    await this._userRepository.resetRefreshTokenById(user.userId);
                    res.status(UNAUTHORIZED).json({ message: ACCOUNT_BLOCKED });
                    return;
                }

                //No common page so for easy handling 401 than 403
                if (requiredRoles && requiredRoles.length > 0) {
                    if (!user.role || !requiredRoles.includes(user.role)) {
                        res.clearCookie("accessToken", options);
                        res.clearCookie("refreshToken", options);
                        await this._userRepository.resetRefreshTokenById(user.userId);
                        res.status(UNAUTHORIZED).json({ message: FORBIDDEN_MSG });
                        return;
                    }
                }
                
                req.user = user;
                next();

            } catch (error) {
                
                if (error.name === "JsonWebTokenError") {
                    res.status(UNAUTHORIZED).json({ message: INVALID_TOKEN });
                    return;
                } else if (error.name === "TokenExpiredError") {
                    res.status(UNAUTHORIZED).json({ message: TOKEN_EXPIRED });
                    return;
                }
                next(error);
            }
        };
    }
}

// Factory function to create the middleware
export const createAuthMiddleware = (tokenService: ITokenService,userRepository: IUserRepository) => {
    const middleware = new AuthMiddleware(tokenService, userRepository);
    return (roles?: RoleEnum[]) => middleware.handle(roles);
};


