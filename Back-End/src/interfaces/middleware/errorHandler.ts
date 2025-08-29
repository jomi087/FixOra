import { Request, Response } from "express";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode";
import { Messages } from "../../shared/Messages";

export const createErrorHandler = (logger: ILoggerService) => {
    return (err: any, req: Request, res: Response) => {
        const status = err.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
        const message = err.message || Messages.INTERNAL_ERROR;

        // if (process.env.NODE_ENV === "development") {
        //     logger.error("🔥 Error Handler Triggered:", { message, stack: err.stack });
        // } else {
        //     logger.error("🔥 Error:", { message });
        // }

        logger.error("🔥 Error Handler Triggered:", {
            message,
            stack: err.stack,
            path: req.originalUrl,
            method: req.method,
        });

        res.status(status).json({
            success: false,
            message,
            ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        });
    };
};
