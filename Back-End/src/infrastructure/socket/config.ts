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
        logger.info("---------Socket Connected--------");
        const { userId, role } = socket.data;

        // Join user-specific room for personal notifications
        socket.join(userId);

        // Join role-based room (e.g., 'admin', 'customer', 'provider')
        if (role) {
            socket.join(role);
        }

        //user join chat room
        socket.on("chat:joinRoom", (chatId: string) => {
            socket.join(chatId);
        });

        //typing event
        socket.on("chat:typing", ({ chatId }) => {
            socket.to(chatId).emit("chat:typing", { userId });
        });

        // ========== CALL SIGNALING ==========
        // Caller → wants to start a call
        socket.on("call:request", (payload: {
            callId: string;
            toUserId: string;
            chatId: string;
        }) => {
            const fromUserId = userId;
            logger.info(`call:request from ${fromUserId} to ${payload.toUserId}`);

            ioInstance.to(payload.toUserId).emit("call:incoming", {
                callId: payload.callId,
                fromUserId,
                chatId: payload.chatId,
            });
        });

        // Callee → accepts call
        socket.on("call:accept", (payload: {
            callId: string;
            toUserId: string; // callerId
        }) => {
            const fromUserId = socket.data.userId; // callee
            logger.info(`call:accept from ${fromUserId} to ${payload.toUserId}`);

            ioInstance.to(payload.toUserId).emit("call:accepted", {
                callId: payload.callId,
                fromUserId,
            });
        });

        // Callee → rejects call
        socket.on("call:reject", (payload: {
            callId: string;
            toUserId: string; // callerId
            reason?: string;
        }) => {
            const fromUserId = socket.data.userId;
            logger.info(`call:reject from ${fromUserId} to ${payload.toUserId}`);

            ioInstance.to(payload.toUserId).emit("call:rejected", {
                callId: payload.callId,
                fromUserId,
                reason: payload.reason ?? "rejected",
            });
        });

        // Caller → cancels before answer
        socket.on("call:cancel", (payload: {
            callId: string;
            toUserId: string; // calleeId
        }) => {
            const fromUserId = socket.data.userId;
            logger.info(`call:cancel from ${fromUserId} to ${payload.toUserId}`);

            ioInstance.to(payload.toUserId).emit("call:cancelled", {
                callId: payload.callId,
                fromUserId,
            });
        });

        // Either side → ends active call
        socket.on("call:end", (payload: {
            callId: string;
            toUserId: string;
        }) => {
            const fromUserId = socket.data.userId;
            logger.info(`call:end from ${fromUserId} to ${payload.toUserId}`);

            ioInstance.to(payload.toUserId).emit("call:ended", {
                callId: payload.callId,
                fromUserId,
            });
        });
        // ====================================================
        // WebRTC: Caller sends offer → relay to callee
        socket.on("call:offer", (payload: {
            callId: string;
            toUserId: string;
            sdp: RTCSessionDescriptionInit;
        }) => {
            const fromUserId = socket.data.userId;
            logger.info(`call:offer from ${fromUserId} to ${payload.toUserId}`);

            ioInstance.to(payload.toUserId).emit("call:offer", {
                callId: payload.callId,
                fromUserId,
                sdp: payload.sdp,
            });
        });

        // WebRTC: Callee sends answer → relay to caller
        socket.on("call:answer", (payload: {
            callId: string;
            toUserId: string;
            sdp: RTCSessionDescriptionInit;
        }) => {
            const fromUserId = socket.data.userId;
            logger.info(`call:answer from ${fromUserId} to ${payload.toUserId}`);

            ioInstance.to(payload.toUserId).emit("call:answer", {
                callId: payload.callId,
                fromUserId,
                sdp: payload.sdp,
            });
        });

        // WebRTC: ICE candidate from either side → relay to peer
        socket.on("call:iceCandidate", (payload: {
            callId: string;
            toUserId: string;
            candidate: RTCIceCandidateInit;
        }) => {
            const fromUserId = socket.data.userId;
            ioInstance.to(payload.toUserId).emit("call:iceCandidate", {
                callId: payload.callId,
                fromUserId,
                candidate: payload.candidate,
            });
        });


        socket.on("disconnect", (reason) => {
            logger.info(`-----------------socket disconnected, Reason: ${reason}-------------`);
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
