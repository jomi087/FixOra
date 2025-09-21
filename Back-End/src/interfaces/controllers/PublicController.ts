import { NextFunction, Request, Response } from "express";
import { IGetLandingDataUseCase } from "../../application/Interface/useCases/Public/IGetLandingDataUseCase";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService";
import { IGetNotificationsUseCase } from "../../application/Interface/useCases/Public/IGetNotificationsUseCase";
import { Messages } from "../../shared/Messages";

const { OK, UNAUTHORIZED } = HttpStatusCode;
const { UNAUTHORIZED_MSG } = Messages;


export class PublicController {
    constructor(
        private _loggerService: ILoggerService,
        private _getLandingDataUseCase: IGetLandingDataUseCase,
        private _getNotificationsUseCase: IGetNotificationsUseCase,
    ) { }

    async getLandingData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const landingData = await this._getLandingDataUseCase.execute();
            res.status(OK).json({
                success: true,
                landingData
            });

        } catch (error: any) {
            this._loggerService.error(`getLandingData error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }
            const userId = req.user.userId;

            const notificationData = await this._getNotificationsUseCase.execute(userId);
            // console.log(notificationData);

            res.status(OK).json({
                success: true,
                notificationData
            });

        } catch (error: any) {
            this._loggerService.error(`getLandingData error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

}