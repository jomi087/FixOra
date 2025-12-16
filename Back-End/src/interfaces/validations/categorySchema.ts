import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";
import { Messages } from "../../shared/const/Messages";
import { z } from "zod";
import { stringMinMax } from "./fields";
import { AppError } from "../../shared/errors/AppError";


const { BAD_REQUEST } = HttpStatusCode;
const {
    CATEGORY_NAME_REQUIRED, CATEGORY_DESCRIPTION_REQUIRED, INVALID_SUBCATEGORIES_JSON,
    AT_LEAST_ONE_SUBCATEGORY_REQUIRED, SUBCATEGORY_NAME_REQUIRED, SUBCATEGORY_DESCRIPTION_REQUIRED,
} = Messages;

export function validateCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, description, subcategories } = req.body;

        if (!name || typeof name !== "string" || !name.trim()) {
            throw new AppError(BAD_REQUEST, CATEGORY_NAME_REQUIRED);
        }

        if (!description || typeof description !== "string" || !description.trim()) {
            throw new AppError(BAD_REQUEST, CATEGORY_DESCRIPTION_REQUIRED);
        }

        let parsedSubcategories: any;
        if (typeof subcategories === "string") {
            try {
                parsedSubcategories = JSON.parse(subcategories);
            } catch {
                throw new AppError(BAD_REQUEST, INVALID_SUBCATEGORIES_JSON);
            }
        } else {
            parsedSubcategories = subcategories;
        }

        if (!Array.isArray(parsedSubcategories) || parsedSubcategories.length === 0) {
            throw new AppError(BAD_REQUEST, AT_LEAST_ONE_SUBCATEGORY_REQUIRED);
        }

        parsedSubcategories.forEach((sub: { name: string; description:string}, index: number) => {
            if (!sub.name || typeof sub.name !== "string" || !sub.name.trim()) {
                throw new AppError(BAD_REQUEST, SUBCATEGORY_NAME_REQUIRED(index + 1));

            }
            if (!sub.description || typeof sub.description !== "string" || !sub.description.trim()) {
                throw new AppError(BAD_REQUEST, SUBCATEGORY_DESCRIPTION_REQUIRED(index + 1));

            }
        });

        //Attach parsed subcategories back to req for controller to use
        req.body.subcategories = parsedSubcategories;

        next();
    } catch (error) {
        next(error);
    }
}

export const updateCategorySchema = z.object({
    name: stringMinMax(4, "Name must be at least 4 characters", 20, "Name must not be more than 20 characters"),
    description: stringMinMax(5, "Description must be at least 5 characters", 50, "Description must not be more than 50 characters"),
    // image comes from req.file, so we don't validate it here
});


