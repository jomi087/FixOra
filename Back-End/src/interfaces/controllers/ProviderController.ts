import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode";
import { IUpdateBookingStatusUseCase } from "../../application/Interface/useCases/Provider/IUpdateBookingStatusUseCase";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService";
import { ProviderResponseStatus } from "../../shared/Enums/ProviderResponse";
import { IGetConfirmBookingsUseCase } from "../../application/Interface/useCases/Provider/IGetConfirmBookingsUseCase";
import { IGetBookingDetailsUseCase } from "../../application/Interface/useCases/Provider/IGetBookingDetailsUseCase";

import { Messages } from "../../shared/Messages";
import { IJobHistoryUseCase } from "../../application/Interface/useCases/Provider/IJobHistoryUseCase";

const { OK, UNAUTHORIZED, NOT_FOUND } = HttpStatusCode;
const { UNAUTHORIZED_MSG, BOOKING_ID_NOT_FOUND } = Messages;



export class ProviderController {
    constructor(
        private _loggerService: ILoggerService,
        private _updateBookingStatusUseCase: IUpdateBookingStatusUseCase,
        private _getConfirmBookingsUseCase: IGetConfirmBookingsUseCase,
        private _getBookingDetailsUseCase: IGetBookingDetailsUseCase,
        private _jobHistoryUseCase: IJobHistoryUseCase
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

    async confirmBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }

            const providerUserId = req.user.userId;
            const data = await this._getConfirmBookingsUseCase.execute(providerUserId);

            res.status(OK).json({
                success: true,
                providerBookingsInfoData: data
            });

        } catch (error: any) {
            this._loggerService.error(`bookings error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async BookingDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bookingId } = req.params;

            if (!bookingId) {
                throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };
            }

            const data = await this._getBookingDetailsUseCase.execute(bookingId);

            res.status(OK).json({
                success: true,
                bookingDetailsData: data
            });

        } catch (error: any) {
            this._loggerService.error(`bookings error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }


    async getJobHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }

            const providerUserId = req.user.userId;

            const currentPage = parseInt(req.query.currentPage as string) || 1;
            const limit = parseInt(req.query.itemsPerPage as string) || 8;

            const result = await this._jobHistoryUseCase.execute({ providerUserId,currentPage, limit });

            res.status(OK).json({
                success: true,
                bookingHistoryData: result.data,
                total: result.total
            });

        } catch (error: any) {
            this._loggerService.error(`bookings error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }


}