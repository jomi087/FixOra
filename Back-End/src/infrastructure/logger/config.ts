import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import fs from "fs";

const logDir = path.join(__dirname, "../../../logs");

// Ensure directories exist
fs.mkdirSync(path.join(logDir, "combined"), { recursive: true });
fs.mkdirSync(path.join(logDir, "error"), { recursive: true });


const combinedTransport = new DailyRotateFile({
    filename: path.join(logDir, "combined", "combined-%DATE%.log"),
    datePattern: process.env.LOG_DATE_PATTERN || "YYYY-MM-DD",
    zippedArchive: process.env.LOG_ZIPPED === "true",
    maxSize: process.env.LOG_MAX_SIZE || "20m",
    maxFiles: process.env.LOG_COMBINED_MAX_FILES || "14d",
    level: process.env.LOG_LEVEL || "info",
});

const errorTransport = new DailyRotateFile({
    filename: path.join(logDir, "error", "error-%DATE%.log"),
    datePattern: process.env.LOG_DATE_PATTERN || "YYYY-MM-DD",
    zippedArchive: process.env.LOG_ZIPPED === "true",
    maxSize: process.env.LOG_MAX_SIZE || "20m",
    maxFiles: process.env.LOG_ERROR_MAX_FILES || "30d",
    level: process.env.LOG_ERROR_LEVEL || "error",
    handleExceptions: true,
});

const loggerLevel =
    process.env.NODE_ENV !== "production" ? "debug" : "info";

export const loggerInstance = createLogger({
    level: loggerLevel,
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
    ),
    transports: [combinedTransport, errorTransport],
    // exitOnError: false, // do not crash after logging
});

// Console logging → human readable
if (process.env.NODE_ENV !== "production") {
    loggerInstance.add(
        new transports.Console({
            level: "debug",
            format: format.combine(
                format.timestamp(),
                format.simple()
            ),
        })
    );
}

/*
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};
*/