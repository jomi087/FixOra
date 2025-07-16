import { Request, Response, NextFunction } from "express";

export function validateCategory( req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, subcategories } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
        throw { status : 400, message : "Category name is required"}
    }

    if (!description || typeof description !== "string" || !description.trim()) {
        throw { status : 400, message : "Category description is required"}
    }

    let parsedSubcategories: any;
    if (typeof subcategories === "string") {
        try {
            parsedSubcategories = JSON.parse(subcategories);
        } catch {
            throw { status : 400, message : 'Invalid subcategories JSON'}
        }
    } else {
      parsedSubcategories = subcategories;
    }

    if (!Array.isArray(parsedSubcategories) || parsedSubcategories.length === 0) {
        throw { status: 400, message: "At least one subcategory is required" }
    }

    parsedSubcategories.forEach((sub: any, index: number) => {
      if (!sub.name || typeof sub.name !== "string" || !sub.name.trim()) {
        throw { status: 400, message: `Subcategory ${index + 1} name is required` };
      }
      if (!sub.description || typeof sub.description !== "string" || !sub.description.trim()) {
        throw { status: 400, message: `Subcategory ${index + 1} description is required` };
      }
    });

    //Attach parsed subcategories back to req for controller to use
    req.body.subcategories = parsedSubcategories;

    next();
  } catch (error: any) {
    next(error)
  }
}

