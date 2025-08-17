import { NextFunction, Request, Response } from "express";
import { ITokenService } from "../../domain/interface/ServiceInterface/ITokenService.js";
import { IUserRepository } from "../../domain/interface/RepositoryInterface/IUserRepository.js";
import { User } from "../../domain/entities/UserEntity.js";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../shared/Messages.js";
import { RoleEnum } from "../../shared/Enums/Roles.js";

const { UNAUTHORIZED,FORBIDDEN } = HttpStatusCode
const { TOKEN_EXPIRED,INVALID_TOKEN,USER_NOT_FOUND,UNAUTHORIZED_MSG,ACCOUNT_BLOCKED,FORBIDDEN_MSG } = Messages

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
        private tokenService: ITokenService,
        private userRepository: IUserRepository
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

                const decode = this.tokenService.verifyAccessToken(token) as { id: string, email: string, role: RoleEnum }
            
                const user = await this.userRepository.findByUserId(decode.id, ["password", "refreshToken"]);
                
                if (!user) {
                    res.status(UNAUTHORIZED).json({ message: USER_NOT_FOUND });
                    return;
                }

                const options = {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax" as const
                }

                if (user.isBlocked) {
                    res.clearCookie('accessToken', options)
                    res.clearCookie('refreshToken', options)
                    await this.userRepository.update({ userId: user.userId }, { refreshToken: "" });
                    res.status(UNAUTHORIZED).json({ message: ACCOUNT_BLOCKED });
                    return;
                }

                //No common page so for easy handling 401 than 403
                if (requiredRoles && requiredRoles.length > 0) {
                    if (!user.role || !requiredRoles.includes(user.role)) {
                        res.clearCookie('accessToken', options)
                        res.clearCookie('refreshToken', options)
                        await this.userRepository.update({ userId: user.userId }, { refreshToken: "" });
                        res.status(UNAUTHORIZED).json({ message: FORBIDDEN_MSG });
                        return
                    }
                }
                
                req.user = user;
                next();

            } catch (error: any) {
                
                if (error.name === "JsonWebTokenError") {
                    res.status(UNAUTHORIZED).json({ message: INVALID_TOKEN });
                    return;
                } else if (error.name === "TokenExpiredError") {
                    res.status(UNAUTHORIZED).json({ message: TOKEN_EXPIRED });
                    return;
                }
                next(error);
            }
        }
    }
}

// Factory function to create the middleware
export const createAuthMiddleware = (tokenService: ITokenService,userRepository: IUserRepository) => {
    const middleware = new AuthMiddleware(tokenService, userRepository);
    return (roles?: RoleEnum[]) => middleware.handle(roles);
};


