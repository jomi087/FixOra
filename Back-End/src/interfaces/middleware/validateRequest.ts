import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { HttpStatusCode } from "../../shared/enumss/HttpStatusCode";
import { Messages } from "../../shared/const/Messages";

type Location = "body" | "query" | "params";

export const validateRequest = (schema: ZodType<any>, location: Location = "body") =>
    (req: Request, res: Response, next: NextFunction) => {
        const target = req[location];
        const result = schema.safeParse(target);
        if (!result.success) {
            const errorMessages = result.error.issues.map((err) => err.message);
            res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: errorMessages[0].split(":")[0] || errorMessages[0] || errorMessages || Messages.VALIDATION_FAILED });
            return;
        };

        Object.assign(req[location], result.data);
        next();
    };
