//implimented with zod was bit hard so validated with plain js

import { Request, Response, NextFunction } from "express";

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
        throw { status: 400, message: "Service required" };
        }

        //specialization
        let parsedSpecialization: any;
        if (typeof specialization === "string") {
            try {
                parsedSpecialization = JSON.parse(specialization);
            } catch {
                throw { status : 400, message : 'Invalid subcategories JSON'}
            }
        } else {
        parsedSpecialization = specialization;
        }
        
        if (!Array.isArray(parsedSpecialization) || parsedSpecialization.length === 0) {
        throw { status: 400, message: "At least one specialization is required" };
        }
        
        parsedSpecialization.forEach((sub) => {
            if (typeof sub !== "string") {
                throw { status: 400, message: `invalid specialization` };
            }   
        })
        
        //ServiceCharge
        const chargeNum = Number(serviceCharge);
        if (isNaN(chargeNum) || chargeNum < 300 || chargeNum > 500) {
            throw { status: 400, message: "Service charge must be between 300 and 500" };
        }

        //D.O.B
        if (!dob?.trim()) {
        throw { status: 400, message: "Date of birth is required" };
        }
        
        const birthDate = new Date(dob);
        
        if (isNaN(birthDate.getTime())) {
            throw { status: 400, message: "Invalid date of birth" };
        }
        
        if (!isLegal(birthDate)) {
            throw { status: 400, message: "Age restricted: must be at least 18" };
        }

        //Gender
        if (!gender || !["Male", "Female", "Other"].includes(gender)) {
        throw { status: 400, message: "Gender must be Male, Female, or Other" };
        }
        
        req.body.specialization = parsedSpecialization; 
        next();
        
    } catch (error) {
        next(error);
    }
}
