
import { Request, Response, NextFunction } from "express";
import { ILoggerService } from "../../domain/interface/serviceInterfaceTempName/ILoggerService";
import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";
import { Messages } from "../../shared/const/Messages";
import { AppError } from "../../shared/errors/AppError";

const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;


export const createErrorHandler = (logger: ILoggerService) => {
    return (err: unknown, req: Request, res: Response, _next: NextFunction) => {

        /*======================
            UNCONTROLLED ERRORS
        =======================*/
        if (!(err instanceof AppError)) {
            const errorObj =
                err instanceof Error ? err : new Error(String(err));

            logger.error("Uncontrolled :-", {
                message: errorObj.message,
                stack: errorObj.stack,
                path: req.originalUrl,
                method: req.method,
            });

            res.status(INTERNAL_SERVER_ERROR).json({
                success: false,
                message: INTERNAL_ERROR,
            });
            return;
        }

        /*======================
            CONTROLLED ERRORS
        ========================*/

        //  Security / Auth related → log as WARN
        if (err.internalMessage) {
            logger.warn("Controlled :-", {
                message: err.message, // internalMessage already here
                path: req.originalUrl,
                method: req.method,
            });
        }

        // Send SAFE message to frontend
        res.status(err.status).json({
            success: false,
            message: err.publicMessage,
        });
    };
};


/* Basic version  (in some scenario i might require not to show the contrlled message to user thats were i updated the logic as above)
export const createErrorHandler = (logger: ILoggerService) => {
    return (err: unknown, req: Request, res: Response, _next: NextFunction) => {
        if (!(err instanceof AppError)) {
            const errorObj = err instanceof Error ? err : new Error(String(err));

            logger.error("Uncontrolled Error Triggered", {
                message: errorObj.message,
                stack: errorObj.stack,
                path: req.originalUrl,
                method: req.method,
            });
        }

        if (err instanceof AppError) {
            res.status(err.status).json({ message: err.publicMessage  });
        } else {
            res.status(INTERNAL_SERVER_ERROR).json({
                success: false,
                message: INTERNAL_ERROR
            });
        }
    };
};
*/