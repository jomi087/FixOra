import { Socket, ExtendedError } from "socket.io";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import { RoleEnum } from "../../shared/enums/Roles";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService";
import { DecodedUserToken } from "../../shared/types/common";



export const socketAuthMiddleware = (logger: ILoggerService) => {
    return (socket: Socket, next: (err?: ExtendedError) => void) => {
        try {
            const rawCookie = socket.handshake.headers.cookie;
            if (!rawCookie) throw new Error("Unauthorized: No cookie provided");

            const parsed = cookie.parse(rawCookie);
            const token = parsed.accessToken;
            if (!token) throw new Error("Unauthorized: Token missing");

            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as DecodedUserToken;
            
            if (![RoleEnum.Provider, RoleEnum.Customer, RoleEnum.Admin].includes(decoded.role)) {
                throw new Error("Unauthorized role");
            }

            socket.data.userId = decoded.id as string;
            socket.data.role = decoded.role as RoleEnum;

            next();
        } catch (error) {

            logger.error("Socket auth error:", error);
            next(new Error("Unauthorized"));
        }
    };
};
