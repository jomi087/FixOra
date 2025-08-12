import { Socket, ExtendedError } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { RoleEnum } from "../../shared/Enums/Roles.js";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService.js";

export const socketAuthMiddleware = (logger: ILoggerService) => {
  return (socket: Socket, next: (err?: ExtendedError) => void) => {
    try {
      logger.info("Socket auth called. rawCookie: " + socket.handshake.headers.cookie);

      const rawCookie = socket.handshake.headers.cookie;
      if (!rawCookie) throw new Error("Unauthorized: No cookie provided");

      const parsed = cookie.parse(rawCookie);
      const token = parsed.accessToken;
      if (!token) throw new Error("Unauthorized: Token missing");

      const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);

      if (![RoleEnum.Provider, RoleEnum.Customer].includes(decoded.role)) {
        throw new Error("Unauthorized role");
      }

      socket.data.userId = decoded.id;
      socket.data.role = decoded.role;

      next();
    } catch (error: any) {
      logger.error("Socket auth error:", error);
      next(error);
    }
  };
};
