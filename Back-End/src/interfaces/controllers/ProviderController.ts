import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode.js";
import { IUpdateBookingStatusUseCase } from "../../application/Interface/useCases/Provider/IUpdateBookingStatusUseCase.js";
// import { IGetBookingsUseCase } from "../../application/Interface/useCases/Provider/IGetBookingsUseCase.js";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService.js";
import { ProviderResponseStatus } from "../../shared/Enums/ProviderResponse.js";

const { OK } = HttpStatusCode;



export class ProviderController {
    constructor(
        private _loggerService: ILoggerService,
        private _updateBookingStatusUseCase: IUpdateBookingStatusUseCase,
    ) {}

    async respondToBookingRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {bookingId} = req.params 
            const { action,reason } = req.body
            
            const data = await this._updateBookingStatusUseCase.execute({
                bookingId,
                action,
                reason : action === ProviderResponseStatus.REJECTED ? reason : undefined
            })
            
            res.status(OK).json({
                success: true,
                updatedBookingStatusData : data
            })

        } catch (error:any) {
            this._loggerService.error(`updateBookingStatus error:, ${error.message}`,{stack : error.stack});
            next(error);
        }
    }

    async bookings(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("hi");
            const userId = req.user?.userId;
            // console.log("aaaaaaaaaaaaaaauserId",userId);
            // throw { status: 404 , message : "blabla bla" }
            // await this.getBookingsUseCase.execute()

            res.status(OK).json({
                success: true,    
            })
        } catch (error:any) {
            this._loggerService.error(`bookings error:, ${error.message}`,{stack : error.stack});
            next(error);
        }   
    }
}