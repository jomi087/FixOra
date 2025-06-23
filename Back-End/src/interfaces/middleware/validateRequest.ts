import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) : void => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errorMessages = result.error.errors.map(err => err.message);
    console.log(result.error)
    throw { status: 400, message: errorMessages[0] || errorMessages };
  }
  req.body = result.data;
  
  next();
};
