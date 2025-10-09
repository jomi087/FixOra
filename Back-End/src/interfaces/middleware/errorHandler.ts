
import { Request, Response, NextFunction } from "express";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode";
import { Messages } from "../../shared/const/Messages";

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

// import { AppError } from "../../shared/ApplicationError";

// export const createErrorHandler = (logger: ILoggerService) => {
//     return (err: unknown, req: Request, res: Response, _next: NextFunction) => {
//         let status = HttpStatusCode.INTERNAL_SERVER_ERROR;
//         let message:string = Messages.INTERNAL_ERROR;

//         if (err instanceof AppError) {
//             status = err.status;
//             message = err.message; 
//         }

//         logger.error("🔥 Error Handler Triggered:", {
//             message: err instanceof Error ? err.message : message,
//             stack: err instanceof Error ? err.stack : undefined,
//             path: req.originalUrl,
//             method: req.method,
//         });

//         res.status(status).json({
//             success: false,
//             message: process.env.NODE_ENV === "development" 
//                 ? message 
//                 : status === HttpStatusCode.INTERNAL_SERVER_ERROR 
//                     ? Messages.INTERNAL_ERROR 
//                     : message,
//             ...(process.env.NODE_ENV === "development" && { stack: err instanceof Error ? err.stack : undefined }),
//         });
//     };
// };