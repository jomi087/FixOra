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
            if (!rawCookie) {
                next(new Error("Unauthorized"));
                return;
            }

            const parsed = cookie.parse(rawCookie);
            const token = parsed.accessToken;
            if (!token) {
                next(new Error("Unauthorized"));
                return;
            }
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as DecodedUserToken;

            if (![RoleEnum.Provider, RoleEnum.Customer, RoleEnum.Admin].includes(decoded.role)) {
                next(new Error("Forbidden"));
                return;
            }

            socket.data.userId = decoded.id as string;
            socket.data.role = decoded.role as RoleEnum;

            next();
        } catch (error: unknown) {
            const errorObj =
                error instanceof Error ? error : new Error(String(error));

            // Log ONLY unexpected auth errors
            logger.warn("Socket auth failed", {
                message: errorObj.message,
                socketId: socket.id,
            });

            next(new Error("Unauthorized"));
        }
    };
};
