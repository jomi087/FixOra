import { NextFunction, Request, Response } from "express";
import { IGetLandingDataUseCase } from "../../application/Interface/useCases/Public/IGetLandingDataUseCase.js";
import { HttpStatusCode } from "../../shared/constant/HttpStatusCode.js";

const { OK} = HttpStatusCode

export class PublicController {
    constructor(
        private getLandingDataUseCase : IGetLandingDataUseCase
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