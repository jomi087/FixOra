//implimented with zod was bit hard so validated with plain js

import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../shared/Messages.js";

const { BAD_REQUEST} = HttpStatusCode
const { SERVICE_REQUIRED, INVALID_SPECIALIZATION, SERVICE_CHARGE_RANGE,AT_LEAST_ONE_SUBCATEGORY_REQUIRED,
    DOB_REQUIRED,INVALID_DOB,AGE_RESTRICTED,INVALID_GENDER,INVALID_SUBCATEGORIES_JSON
} = Messages

function isLegal(birthDate: Date):boolean {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) age--;

    return (age >= 18)
}

export function validateKYCRequest(req: Request, res: Response, next: NextFunction) {
    try {
        const { service, specialization, serviceCharge, dob, gender  } = req.body;

        //service
        if (!service?.trim()) {
        throw { status: BAD_REQUEST, message: SERVICE_REQUIRED };
        }

        //specialization
        let parsedSpecialization: any;
        if (typeof specialization === "string") {
            try {
                parsedSpecialization = JSON.parse(specialization);
            } catch {
                throw { status : BAD_REQUEST, message : INVALID_SUBCATEGORIES_JSON }
            }
        } else {
        parsedSpecialization = specialization;
        }
        
        if (!Array.isArray(parsedSpecialization) || parsedSpecialization.length === 0) {
        throw { status: BAD_REQUEST, message: AT_LEAST_ONE_SUBCATEGORY_REQUIRED };
        }
        
        parsedSpecialization.forEach((sub) => {
            if (typeof sub !== "string") {
                throw { status: BAD_REQUEST, message: INVALID_SPECIALIZATION };
            }   
        })
        
        //ServiceCharge
        const chargeNum = Number(serviceCharge);
        if (isNaN(chargeNum) || chargeNum < 300 || chargeNum > 500) {
            throw { status: BAD_REQUEST, message: SERVICE_CHARGE_RANGE };
        }

        //D.O.B
        if (!dob?.trim()) {
        throw { status: BAD_REQUEST, message: DOB_REQUIRED };
        }
        
        const birthDate = new Date(dob);
        
        if (isNaN(birthDate.getTime())) {
            throw { status: BAD_REQUEST, message: INVALID_DOB };
        }
        
        if (!isLegal(birthDate)) {
            throw { status: BAD_REQUEST, message: AGE_RESTRICTED };
        }

        //Gender
        if (!gender || !["Male", "Female", "Other"].includes(gender)) {
        throw { status: BAD_REQUEST, message: INVALID_GENDER };
        }
        
        req.body.specialization = parsedSpecialization; 
        next();
        
    } catch (error) {
        next(error);
    }
}
