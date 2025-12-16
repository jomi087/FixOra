import { NextFunction, Request, Response } from "express";
import { IGetLandingDataUseCase } from "../../application/Interface/useCases/Public/IGetLandingDataUseCase";
import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";
import { IGetNotificationsUseCase } from "../../application/Interface/useCases/Public/IGetNotificationsUseCase";
import { Messages } from "../../shared/const/Messages";
import { INotificationAcknowledgmentUseCase } from "../../application/Interface/useCases/Public/INotificationAcknowledgmentUseCase";
import { AppError } from "../../shared/errors/AppError";

const { OK, UNAUTHORIZED, NOT_FOUND } = HttpStatusCode;
const { UNAUTHORIZED_MSG, NOT_FOUND_MSG } = Messages;

export class PublicController {
    constructor(
        private _getLandingDataUseCase: IGetLandingDataUseCase,
        private _getNotificationsUseCase: IGetNotificationsUseCase,
        private _notificationAcknowledgmentUseCase: INotificationAcknowledgmentUseCase
    ) { }

    async getLandingData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const landingData = await this._getLandingDataUseCase.execute();
            res.status(OK).json({
                success: true,
                landingData
            });

        } catch (error: unknown) {
            next(error);
        }
    }

    async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }
            const userId = req.user.userId;

            const notificationData = await this._getNotificationsUseCase.execute(userId);
            // console.log(notificationData);

            res.status(OK).json({
                success: true,
                notificationData
            });

        } catch (error) {
            next(error);
        }
    }

    async acknowledgeNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { notificationId } = req.params;

            if (!notificationId || notificationId === "undefined") {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Notificaiton"));
            }

            // console.log("entered ", notificationId);
            await this._notificationAcknowledgmentUseCase.execute(notificationId);

            res.status(OK).json({ success: true });

        } catch (error) {
            next(error);
        }
    }

}