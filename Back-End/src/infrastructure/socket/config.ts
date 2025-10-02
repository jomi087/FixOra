import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { socketAuthMiddleware } from "./authMiddleware";
import type { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService";


export let ioInstance: SocketIOServer;

export const initializeSocket = (httpServer: HTTPServer, logger: ILoggerService) => {
    ioInstance = new SocketIOServer(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL, //env
            methods: ["GET", "POST", "PATCH"],
            credentials: true,
        },
    });

    ioInstance.use(socketAuthMiddleware(logger));

    //socket Event listners
    ioInstance.on("connection", (socket) => {
        const { userId, role } = socket.data;

        // Join user-specific room for personal notifications
        socket.join(userId);

        // Join role-based room (e.g., 'admin', 'customer', 'provider')
        if (role) {
            socket.join(role);
        }

        logger.info(`---------${role} ${userId} joined room ${userId}------------`);

        socket.on("disconnect", (reason) => {
            logger.info(`-----User ${userId} disconnected. Reason: ${reason}-------------`);
        });

        socket.on("error", (error) => {
            logger.error(`Socket error for user ${userId}:`, error);
        });

    });

    return ioInstance;
};

export const getIO = () => {
    if (!ioInstance) throw new Error("Socket.IO not initialized");
    return ioInstance;
};
