import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) : void => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errorMessages = result.error.errors.map(err => err.message);
    res.status(400).json({ success: false, errors: errorMessages });
    return
  }

  req.body = result.data;
  next();
};
