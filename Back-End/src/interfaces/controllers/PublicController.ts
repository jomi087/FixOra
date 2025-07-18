import { NextFunction, Request, Response } from "express";
import { GetLandingDataUseCase } from "../../application/useCases/public/GetLandingDataUseCase.js";

export class PublicController {
    constructor(
        private getLandingDataUseCase : GetLandingDataUseCase
    ){}
    
    async getLandingData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const landingData = await this.getLandingDataUseCase.execute()
            res.status(200).json({
                success: true,
                landingData
            })
            
        } catch (error) {
            console.error("getLandingData error:", error);
            next(error);
        }
    }
}