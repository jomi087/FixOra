import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../shared/constant/HttpStatusCode.js";
import { Messages } from "../../shared/constant/Messages.js";


const { BAD_REQUEST} = HttpStatusCode
const {
  CATEGORY_NAME_REQUIRED, CATEGORY_DESCRIPTION_REQUIRED, INVALID_SUBCATEGORIES_JSON,
  AT_LEAST_ONE_SUBCATEGORY_REQUIRED,SUBCATEGORY_NAME_REQUIRED,SUBCATEGORY_DESCRIPTION_REQUIRED,
} = Messages

export function validateCategory( req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, subcategories } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
        throw { status : BAD_REQUEST, message : CATEGORY_NAME_REQUIRED }
    }

    if (!description || typeof description !== "string" || !description.trim()) {
        throw { status : BAD_REQUEST, message : CATEGORY_DESCRIPTION_REQUIRED }
    }

    let parsedSubcategories: any;
    if (typeof subcategories === "string") {
        try {
            parsedSubcategories = JSON.parse(subcategories);
        } catch {
            throw { status : BAD_REQUEST, message : INVALID_SUBCATEGORIES_JSON }
        }
    } else {
      parsedSubcategories = subcategories;
    }

    if (!Array.isArray(parsedSubcategories) || parsedSubcategories.length === 0) {
        throw { status: BAD_REQUEST, message: AT_LEAST_ONE_SUBCATEGORY_REQUIRED }
    }

    parsedSubcategories.forEach((sub: any, index: number) => {
      if (!sub.name || typeof sub.name !== "string" || !sub.name.trim()) {
        throw { status: BAD_REQUEST, message: SUBCATEGORY_NAME_REQUIRED(index + 1) };
      }
      if (!sub.description || typeof sub.description !== "string" || !sub.description.trim()) {
        throw { status: BAD_REQUEST, message: SUBCATEGORY_DESCRIPTION_REQUIRED(index + 1)};
      }
    });

    //Attach parsed subcategories back to req for controller to use
    req.body.subcategories = parsedSubcategories;

    next();
  } catch (error: any) {
    next(error)
  }
}

