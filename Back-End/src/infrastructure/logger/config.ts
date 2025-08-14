import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import { fileURLToPath } from 'url'; 
import fs from "fs";

const __filename = fileURLToPath(import.meta.url) // why this way cz esmodule dosent directly support __dirname 
const __dirname = path.dirname(__filename)
const logDir = path.join(__dirname, "../../../logs");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const combinedTransport = new DailyRotateFile({
    filename: path.join(logDir, "combined-%DATE%.log"),
    datePattern: "YYYY-MM-DD",          //  creates a new log file every day at midnight
    zippedArchive: true,                // compress previous log files into .gz when rotated
    maxSize: "20m",                    // if a log file exceeds 20 MB during the day, it will rotate early
    maxFiles: "14d",                   // keep logs (raw + compressed) for 14 days, then delete
    level: "info"
});

const errorTransport = new DailyRotateFile({
    filename: path.join(logDir, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
    level: "error",
    handleExceptions: true          //This makes the transport catch uncaught exceptions and log them
});


export const loggerInstance = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.json()
    ),
    transports: [
        combinedTransport,
        errorTransport,
    ],
});

if (process.env.NODE_ENV !== "production") { //in devlopement instead of json format as in logs folder way  logger will display in the console format  
    loggerInstance.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}


 