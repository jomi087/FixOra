import { NextFunction, Request, Response } from "express";
import { Messages } from "../../shared/Messages.js";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode.js";
import { BookingStatus } from "../../shared/Enums/BookingStatus.js";
import { IUpdateBookingStatusUseCase } from "../../application/Interface/useCases/Provider/IUpdateBookingStatusUseCase.js";
import { IGetBookingsUseCase } from "../../application/Interface/useCases/Provider/IGetBookingsUseCase.js";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService.js";

const { OK } = HttpStatusCode;
// const {  } = Messages;


export class ProviderController {
    constructor(
        private loggerService: ILoggerService,
        private updateBookingStatusUseCase: IUpdateBookingStatusUseCase,
    ) {}

    async updateBookingStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {bookingId} = req.params 
            const { status,reason } = req.body
            
            const data = await this.updateBookingStatusUseCase.execute({
                bookingId,
                status,
                reason : status === BookingStatus.REJECTED ? reason : undefined
            })
            
            res.status(OK).json({
                success: true,
                updatedBookingStatusData : data
            })

        } catch (error:any) {
            this.loggerService.error(`updateBookingStatus error:, ${error.message}`,{stack : error.stack});
            next(error);
        }
    }

    async bookings(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("hi");
            const userId = req.user?.userId;
            console.log("aaaaaaaaaaaaaaauserId",userId);
            throw { status: 404 , message : "blabla bla" }
            // await this.getBookingsUseCase.execute()

            res.status(OK).json({
                success: true,    
            })
        } catch (error:any) {
            this.loggerService.error(`bookings error:, ${error.message}`,{stack : error.stack});
            next(error);
        }   
    }
}