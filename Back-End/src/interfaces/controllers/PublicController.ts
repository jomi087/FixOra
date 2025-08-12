import { NextFunction, Request, Response } from "express";
import { IGetLandingDataUseCase } from "../../application/Interface/useCases/Public/IGetLandingDataUseCase.js";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode.js";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService.js";

const { OK} = HttpStatusCode

export class PublicController {
    constructor(
        private loggerService: ILoggerService,
        private getLandingDataUseCase : IGetLandingDataUseCase
    ){}
    
    async getLandingData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const landingData = await this.getLandingDataUseCase.execute()
            res.status(OK).json({
                success: true,
                landingData
            })
            
        } catch (error:any) {
            this.loggerService.error(`getLandingData error:, ${error.message}`,{stack : error.stack});
            next(error);
        }
    }
}