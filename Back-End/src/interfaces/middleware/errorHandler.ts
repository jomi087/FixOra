import { Request, Response, NextFunction } from "express";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService.js";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../shared/Messages.js";

export const createErrorHandler = (logger: ILoggerService) => {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
    const message = err.message || Messages.INTERNAL_ERROR;

    if (process.env.NODE_ENV === "development") {
        console.log("enter error handler check log folder error file")
        logger.error("🔥 Error Handler Triggered:", { message, stack: err.stack });
    } else {
        logger.error("🔥 Error:", { message });
    }

    res.status(status).json({
      success: false,
      message,
    });
  };
};
