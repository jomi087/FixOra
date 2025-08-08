import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../shared/Messages.js";

export const errorHandler = ( err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
    const message = err.message || Messages.INTERNAL_ERROR ;

    if (process.env.NODE_ENV === "development") {
        console.error("🔥 Error Handler Triggered:");
        console.error("📌 Message:", message);
        console.error("📌 Stack:", err.stack);
    } else {
        console.error("🔥 Error:", message);
        
    }
    res.status(status).json({
        success: false,
        message
    });
};
