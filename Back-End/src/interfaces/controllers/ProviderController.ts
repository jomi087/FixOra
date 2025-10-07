import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode";
import { IUpdateBookingStatusUseCase } from "../../application/Interface/useCases/Provider/IUpdateBookingStatusUseCase";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService";
import { ProviderResponseStatus } from "../../shared/Enums/ProviderResponse";
import { IGetConfirmBookingsUseCase } from "../../application/Interface/useCases/Provider/IGetConfirmBookingsUseCase";
import { IGetJobDetailsUseCase } from "../../application/Interface/useCases/Provider/IGetJobDetailsUseCase";

import { Messages } from "../../shared/Messages";
import { IJobHistoryUseCase } from "../../application/Interface/useCases/Provider/IJobHistoryUseCase";
import { IVerifyArrivalUseCase } from "../../application/Interface/useCases/Provider/IVerifyArrivalUseCase";
import { IVerifyArrivalOtpUseCase } from "../../application/Interface/useCases/Provider/IVerifyArrivalOtpUseCase";
import { ISetAvailabilityUseCase } from "../../application/Interface/useCases/Provider/ISetAvailabilityUseCase";
import { IGetAvailabilityUseCase } from "../../application/Interface/useCases/Provider/IGetAvailabilityUseCase";
import { IToggleAvailabilityUseCase } from "../../application/Interface/useCases/Provider/IToggleAvailabilityUseCase";
import { allowedTypes, maxSizeMB } from "../../shared/constants";
import validateFile from "../validations/fileValidation";
import { IWorkCompletionUseCase } from "../../application/Interface/useCases/Provider/IWorkCompletionUseCase";

const { OK, UNAUTHORIZED, NOT_FOUND } = HttpStatusCode;
const { UNAUTHORIZED_MSG, BOOKING_ID_NOT_FOUND } = Messages;

export class ProviderController {
    constructor(
        private _loggerService: ILoggerService,
        private _updateBookingStatusUseCase: IUpdateBookingStatusUseCase,
        private _getConfirmBookingsUseCase: IGetConfirmBookingsUseCase,
        private _getJobDetailsUseCase: IGetJobDetailsUseCase,
        private _jobHistoryUseCase: IJobHistoryUseCase,
        private _verifyArrivalUseCase: IVerifyArrivalUseCase,
        private _verifyArrivalOtpUseCase: IVerifyArrivalOtpUseCase,
        private _workCompletionUseCase: IWorkCompletionUseCase,
        private _getAvailabilityUseCase: IGetAvailabilityUseCase,
        private _setAvailabilityUseCase: ISetAvailabilityUseCase,
        private _toggleAvailabilityUseCase: IToggleAvailabilityUseCase,
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

    async jobDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bookingId } = req.params;

            if (!bookingId) {
                throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };
            }

            const data = await this._getJobDetailsUseCase.execute(bookingId);

            res.status(OK).json({
                success: true,
                jobDetailsData: data
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

            const result = await this._jobHistoryUseCase.execute({ providerUserId, currentPage, limit });

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

    async arrivalOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bookingId } = req.params;
            const token = await this._verifyArrivalUseCase.execute(bookingId);

            res.cookie("arrivaltoken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", //now its false //later while converting it to http to https we have to make it true , so this will not allow the cookie to be sent over http ,currently it will alowed in both http and https  
                sameSite: "lax",
                maxAge: 10 * 60 * 1000 // temp token  for 10 mints  
            });


            res.status(OK).json({
                success: true,
                message: "An OTP sent successfully to user"
            });

        } catch (error: any) {
            this._loggerService.error(`bookings error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async verifyArrivalOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { otp } = req.body;

            const token = req.cookies.arrivaltoken;
            await this._verifyArrivalOtpUseCase.execute(otp, token);

            res.clearCookie("arrivaltoken");

            res.status(OK).json({
                success: true,
                message: "SucessFull"
            });

        } catch (error: any) {
            this._loggerService.error(`bookings error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async acknowledgeCompletionWithProof(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // console.log(req.body);
            // console.log(req.files);

            const files = req.files as Express.Multer.File[];

            if (!files || files.length === 0) {
                throw new Error("At least one work proof image is required");
            }
            if (files.length > 3) {
                throw new Error("You can upload up to 3 images only");
            }
            for (const file of files) {
                const error = validateFile(file, allowedTypes, maxSizeMB);
                if (error) {
                    throw { status: 400, message: error };
                }
            }

            const { bookingId, diagnose, parts: stringifyParts } = req.body;

            let parts: { name: string; cost: string;}[] = [];
            if (stringifyParts) {
                parts = JSON.parse(stringifyParts);
            }
            const plainFiles = files.map(file => ({
                buffer: file.buffer,
                originalname: file.originalname,
            }));

            const { status, workProofUrls, diagnosed } = await this._workCompletionUseCase.execute({
                bookingId,
                plainFiles,
                diagnose,
                parts
            });

            res.status(OK).json({
                success: true,
                message: "success",
                bookingStatus: status,
                workProofUrls,
                diagnosis: diagnosed
            });

        } catch (error: any) {
            this._loggerService.error(`bookings error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async getAvailabilityTime(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }
            const providerUserId = req.user.userId;

            let mappedData = await this._getAvailabilityUseCase.execute(providerUserId);

            res.status(OK).json({
                success: true,
                message: "Availability fetched successfully",
                availabilityData: mappedData,
            });

        } catch (error: any) {
            this._loggerService.error(`bookings error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async scheduleAvailabilityTime(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { schedule } = req.body;
            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }
            const providerUserId = req.user.userId;

            let mappedData = await this._setAvailabilityUseCase.execute({ schedule, providerUserId });

            res.status(OK).json({
                success: true,
                message: "SucessFull",
                availabilityData: mappedData,
            });

        } catch (error: any) {
            this._loggerService.error(`bookings error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async toggleAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { day, leaveOption } = req.body;

            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }
            const providerUserId = req.user.userId;

            await this._toggleAvailabilityUseCase.execute({ day, providerUserId, leaveOption });

            res.status(OK).json({
                success: true,
                message: "status updated",
            });

        } catch (error: any) {
            this._loggerService.error(`bookings error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

}