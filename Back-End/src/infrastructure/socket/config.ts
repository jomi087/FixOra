import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { socketAuthMiddleware } from "./authMiddleware.js";


export let ioInstance: SocketIOServer;

export const initializeSocket = (httpServer: HTTPServer) => {
  ioInstance = new SocketIOServer(httpServer, {
      cors: {
      origin: process.env.FRONTEND_URL, //env
      methods: ["GET", "POST", "PATCH"],
      credentials: true,
      },
  });
  // console.log("ioInstance", ioInstance)
  // ioInstance._connectTimeout = 10000
  ioInstance.use(socketAuthMiddleware);

  
  //socket Event listners
  ioInstance.on("connection", (socket) => {
    const { userId, role } = socket.data;
  
    socket.join(userId)
    console.log(`${role} ${userId} joined room ${userId}`);
    
    socket.on("disconnect", () => {
        console.log("Provider disconnected:", socket.id);
    });
  })

  return ioInstance;         
};

export const getIO = () => {
  if (!ioInstance) throw new Error("Socket.IO not initialized");
  return ioInstance;
};
