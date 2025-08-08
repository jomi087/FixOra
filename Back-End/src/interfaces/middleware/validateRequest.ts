import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../shared/Messages.js";

type Location = "body" | "query" | "params";

export const validateRequest = (schema: ZodSchema<any>, location: Location = "body") => (req: Request, res: Response, next: NextFunction): void => {
  const target = req[location];

  const result = schema.safeParse(target);
  if (!result.success) {
    const errorMessages = result.error.errors.map((err) => err.message);
    throw { status: HttpStatusCode.BAD_REQUEST, message: errorMessages[0] || errorMessages || Messages.VALIDATION_FAILED };
  };

  Object.assign(req[location], result.data);
  next();
};

//  The below code  was my zod validtion for data which is comming from body  now i chaged it and made it for  3 types 
// export const validateRequest = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) : void => {
//   const result = schema.safeParse(req.body);

//   if (!result.success) {
//     const errorMessages = result.error.errors.map(err => err.message);
//     console.log(result.error)
//     throw { status: 400, message: errorMessages[0] || errorMessages };
//   }
//   req.body = result.data;
  
//   next();
// };

