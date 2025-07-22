import { NextFunction, Request, Response } from "express";
import { GetLandingDataUseCase } from "../../application/useCases/public/GetLandingDataUseCase.js";
import { HttpStatusCode } from "../../shared/constant/HttpStatusCode.js";

const { OK} = HttpStatusCode

export class PublicController {
    constructor(
        private getLandingDataUseCase : GetLandingDataUseCase
    ){}
    
    async getLandingData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const landingData = await this.getLandingDataUseCase.execute()
            res.status(OK).json({
                success: true,
                landingData
            })
            
        } catch (error) {
            console.error("getLandingData error:", error);
            next(error);
        }
    }
}