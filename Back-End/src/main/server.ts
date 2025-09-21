// From node_modules
import express, { Express } from "express";
import http from "http";
import path from "path";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

//From Local files
import { BodyParserLimits } from "../shared/constants";

import publicRoutes from "../interfaces/routes/publicRoute";
import authRoutes from "../interfaces/routes/authRoute";
import userRoutes from "../interfaces/routes/userRoute";
import providerRoutes from "../interfaces/routes/providerRoute";
import adminRoutes from "../interfaces/routes/adminRoute";
import rawRoutes from "../interfaces/routes/rawRoute";

import mongoConnect from "../infrastructure/database/connection";
import { initializeSocket } from "../infrastructure/socket/config";

import { errorHandler } from "./dependencyInjector";
import { WinstonLogger } from "../infrastructure/services/WinstonLoggerService";
const logger = new WinstonLogger();

const app: Express = express();
const port = process.env.PORT;

const stream = {
    write: (message: string) => {
        logger.info(message.trim());  // send morgan logs to Winston
    }
};

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization","X-Requested-With","Accept","Origin"]
};

// // Connect to MongoDB
mongoConnect(logger);

app.use("/api", rawRoutes); //instead of parsing buffer to json we are passing as buffer it self

// //Middleware
app.use(cookieParser());
app.use(morgan("tiny", { stream }));
app.use(cors(corsOptions));
app.use(express.json({ limit: BodyParserLimits.JSON_LIMIT }));//Your server will only accept JSON request bodies up to 1 mB in size
app.use(express.urlencoded({ extended: true, limit: BodyParserLimits.URLENCODED_LIMIT }));
app.use(express.static(path.join(__dirname, "../public")));  

app.use("/api",publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/provider",providerRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);

const server = http.createServer(app); // this was implimented so that i can get the server instanace (server obj) which is required is socket i.O other-wise we only use the listen method of server
initializeSocket(server,logger);
logger.info("Socket.IO initialized");

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection", reason);
    process.exit(1);
});
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception", err);
    process.exit(1);
});

server.listen(port, () => {
    logger.info(`Server is started running in http://localhost:${port}`);
});

