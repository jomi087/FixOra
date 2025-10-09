import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import fs from "fs";

const logDir = path.join(__dirname, "../../../logs");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const combinedTransport = new DailyRotateFile({
    filename: path.join(logDir, "combined-%DATE%.log"),
    datePattern: process.env.LOG_DATE_PATTERN,                  //  creates a new log file every day at midnight (default frequency is set to 24hrs thats y every day new file is created to make more then one day chage it explicitly to ny hours like 48h )
    zippedArchive: process.env.LOG_ZIPPED === "true",           // compress previous log files into .gz when rotated
    maxSize: process.env.LOG_MAX_SIZE,                                             // if a log file exceeds 20 MB during the day, it will rotate early
    maxFiles: process.env.LOG_COMBINED_MAX_FILES,                                           // keep logs (raw + compressed) for 14 days, then delete
    level: process.env.LOG_LEVEL
});

const errorTransport = new DailyRotateFile({
    filename: path.join(logDir, "error-%DATE%.log"),
    datePattern: process.env.LOG_DATE_PATTERN,
    zippedArchive: process.env.LOG_ZIPPED === "true",
    maxSize: process.env.LOG_MAX_SIZE,
    maxFiles: process.env.LOG_ERROR_MAX_FILES,
    level: process.env.LOG_ERROR_LEVEL,
    handleExceptions: process.env.LOG_HANDLE_EXCEPTIONS === "true"    //This makes the transport catch uncaught exceptions and log them
});


export const loggerInstance = winston.createLogger({
    level: process.env.LOG_LEVEL,
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


 