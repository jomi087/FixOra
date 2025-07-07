import { NextFunction, Request, Response } from "express";
import { ITokenService } from "../../domain/interface/ServiceInterface/ITokenService.js";
import { IUserRepository } from "../../domain/interface/RepositoryInterface/IUserRepository.js";
import { User } from "../../domain/entities/UserEntity.js";

// Extend Express Request type  
declare global {
    namespace Express {
        interface Request {
            user?: Partial<User>;
        }
    }
}

export class UserAuthMiddleware {  //verify Jwt
    constructor(
        private tokenService: ITokenService,
        private userRepository: IUserRepository
    ) {}

    async handle( req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
            if (!token) {
                res.status(401).json({
                    message: "Unauthorized-Signin again (token not provided)",
                });
                return;
            }
            const decode = this.tokenService.verifyAccessToken(token);
            const user = await this.userRepository.findByUserId(decode.id,["password","refreshToken"]);
            
            if (!user) {
                res.status(401).json({ message: "User not Found" });
                return;
            }

            if (user.isBlocked) {
                const options  = {
                    httpOnly: true,
                    secure: process.env.NODE_COOKIE_ENV === "production",
                    sameSite: "lax" as const
                }
            
                res.clearCookie('accessToken', options)
                res.clearCookie('refreshToken', options)
                await this.userRepository.update({ userId: user.userId }, { refreshToken: "" });
                res.status(403).json({ message: "Account Blocked, Contanct support" });
                return;
            }

            //isBlock logic to be added later
            req.user = user;
            next();

        } catch (error: any) {
            
            if (error.name === "JsonWebTokenError") {
                res.status(401).json({ message: "Invalid token" });
                return;
            } else if (error.name === "TokenExpiredError") {
                console.log("expiry")
                res.status(401).json({ message: "Token expired" });
                return;
            }
            next(error);
        }
    }
}

// Factory function to create the middleware
export const createUserAuthMiddleware = (tokenService: ITokenService,userRepository: IUserRepository) => {
    const middleware = new UserAuthMiddleware(tokenService, userRepository);
    return (req: Request, res: Response, next: NextFunction) => middleware.handle(req, res, next);
};


