// import { Request, Response , NextFunction } from "express";
// // import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService";
// import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode";
// import { Messages } from "../../shared/Messages";

// export const errorHandler = (err: any, req: Request, res: Response ,next: NextFunction) => {
//     console.log("testing log acvc",err);
//     const status = err.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
//     const message = err.message || Messages.INTERNAL_ERROR;

//     res.status(status).json({
//         success: false,
//         message,
//         ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
//     });
// };



import { Request, Response, NextFunction } from "express";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode";
import { Messages } from "../../shared/Messages";

export const createErrorHandler = (logger: ILoggerService) => {
    return (err: any, req: Request, res: Response, _next: NextFunction) => {
        
        const status = err.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
        const message = err.message || Messages.INTERNAL_ERROR;

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


