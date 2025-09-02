import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode";
import { IUpdateBookingStatusUseCase } from "../../application/Interface/useCases/Provider/IUpdateBookingStatusUseCase";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService";
import { ProviderResponseStatus } from "../../shared/Enums/ProviderResponse";
import { IGetConfirmBookingsUseCase } from "../../application/Interface/useCases/Provider/IGetConfirmBookingsUseCase";
import { Messages } from "../../shared/Messages";

const { OK,UNAUTHORIZED, } = HttpStatusCode;
const { UNAUTHORIZED_MSG } = Messages;



export class ProviderController {
    constructor(
        private _loggerService: ILoggerService,
        private _updateBookingStatusUseCase: IUpdateBookingStatusUseCase,
        private _getConfirmBookingsUseCase: IGetConfirmBookingsUseCase,
    ) { }

    async respondToBookingRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bookingId } = req.params;
            const { action, reason } = req.body;

            const data = await this._updateBookingStatusUseCase.execute({
                bookingId,
                action,
                reason: action === ProviderResponseStatus.REJECTED ? reason : undefined
            });

            res.status(OK).json({
                success: true,
                updatedBookingStatusData: data
            });

        } catch (error: any) {
            this._loggerService.error(`updateBookingStatus error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async confirmBookings (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }

            const providerUserId = req.user.userId;
            const data = await this._getConfirmBookingsUseCase.execute(providerUserId);

            res.status(OK).json({
                success: true,
                providerBookingsInfoData : data
            });

        } catch (error: any) {
            this._loggerService.error(`bookings error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }
}