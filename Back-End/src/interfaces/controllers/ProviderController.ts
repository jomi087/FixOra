import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";
import { IUpdateBookingStatusUseCase } from "../../application/interface/useCases/provider/IUpdateBookingStatusUseCase";
import { ProviderResponseStatus } from "../../shared/enums/ProviderResponse";
import { IGetConfirmBookingsUseCase } from "../../application/interface/useCases/provider/IGetConfirmBookingsUseCase";
import { IGetJobDetailsUseCase } from "../../application/interface/useCases/provider/IGetJobDetailsUseCase";

import { Messages } from "../../shared/const/Messages";
import { IJobHistoryUseCase } from "../../application/interface/useCases/provider/IJobHistoryUseCase";
import { IVerifyArrivalUseCase } from "../../application/interface/useCases/provider/IVerifyArrivalUseCase";
import { IVerifyArrivalOtpUseCase } from "../../application/interface/useCases/provider/IVerifyArrivalOtpUseCase";
import { ISetAvailabilityUseCase } from "../../application/interface/useCases/provider/ISetAvailabilityUseCase";
import { IGetAvailabilityUseCase } from "../../application/interface/useCases/provider/IGetAvailabilityUseCase";
import { IToggleAvailabilityUseCase } from "../../application/interface/useCases/provider/IToggleAvailabilityUseCase";
import { allowedTypes, maxSizeMB } from "../../shared/const/constants";
import validateFile from "../validations/fileValidation";
import { IWorkCompletionUseCase } from "../../application/interface/useCases/provider/IWorkCompletionUseCase";
import { IPendingBookingRequestUseCase } from "../../application/interface/useCases/provider/IPendingBookingRequestUseCase";
import { IProviderServiceInfoUseCase } from "../../application/interface/useCases/provider/IProviderServiceInfoUseCase";
import { IProviderServiceUseCase } from "../../application/interface/useCases/provider/IProviderServiceUseCase";
import { IProviderDataUpdateUseCase } from "../../application/interface/useCases/provider/IProviderDataUpdateUseCase";
import { SalesPreset } from "../../shared/types/salesReport";
import { IGetSalesReportUseCase } from "../../application/interface/useCases/provider/IGetSalesReportUseCase";
import { AppError } from "../../shared/errors/AppError";

const { OK, UNAUTHORIZED, NOT_FOUND, BAD_REQUEST } = HttpStatusCode;
const { UNAUTHORIZED_MSG, NOT_FOUND_MSG, REQUIRED, IMAGE_VALIDATION_ERROR } = Messages;

export class ProviderController {
    constructor(
        private _pendingBookingRequestUseCase: IPendingBookingRequestUseCase,
        private _updateBookingStatusUseCase: IUpdateBookingStatusUseCase,
        private _getConfirmBookingsUseCase: IGetConfirmBookingsUseCase,
        private _getJobDetailsUseCase: IGetJobDetailsUseCase,
        private _jobHistoryUseCase: IJobHistoryUseCase,
        private _verifyArrivalUseCase: IVerifyArrivalUseCase,
        private _verifyArrivalOtpUseCase: IVerifyArrivalOtpUseCase,
        private _workCompletionUseCase: IWorkCompletionUseCase,
        private _providerServiceUseCase: IProviderServiceUseCase,
        private _providerServiceInfoUseCase: IProviderServiceInfoUseCase,
        private _providerDataUpdateUseCase: IProviderDataUpdateUseCase,
        private _getAvailabilityUseCase: IGetAvailabilityUseCase,
        private _setAvailabilityUseCase: ISetAvailabilityUseCase,
        private _toggleAvailabilityUseCase: IToggleAvailabilityUseCase,
        private _getSalesReportUseCase: IGetSalesReportUseCase,
    ) { }

    //Booking
    async pendingBookingRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }

            const providerUserId = req.user.userId;

            const result = await this._pendingBookingRequestUseCase.execute(providerUserId);

            res.status(OK).json({
                success: true,
                pendingBookingRequestData: result
            });

        } catch (error) {
            next(error);
        }
    }

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

        } catch (error) {
            next(error);
        }
    }

    async confirmBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }

            const providerUserId = req.user.userId;
            const data = await this._getConfirmBookingsUseCase.execute(providerUserId);

            res.status(OK).json({
                success: true,
                providerBookingsInfoData: data
            });

        } catch (error) {
            next(error);
        }
    }

    async jobDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bookingId } = req.params;

            if (!bookingId) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));
            }

            const data = await this._getJobDetailsUseCase.execute(bookingId);

            res.status(OK).json({
                success: true,
                jobDetailsData: data
            });

        } catch (error) {
            next(error);
        }
    }

    async getJobHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
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

        } catch (error) {
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
                sameSite: "none",
                maxAge: 10 * 60 * 1000 // temp token  for 10 mints  
            });


            res.status(OK).json({
                success: true,
                message: "An OTP sent successfully to user"
            });

        } catch (error) {
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

        } catch (error) {
            next(error);
        }
    }

    async acknowledgeCompletionWithProof(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const files = req.files as Express.Multer.File[];

            if (!files) {
                throw new AppError(BAD_REQUEST, REQUIRED("Work proof images"));
            }

            for (const file of files) {
                const validationError = validateFile(file, allowedTypes, maxSizeMB);
                if (validationError) {
                    throw new AppError(BAD_REQUEST, validationError || IMAGE_VALIDATION_ERROR);
                }
            }

            const { bookingId, diagnose, parts } = req.body;

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

        } catch (error) {
            next(error);
        }
    }

    //profile
    async providerServices(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }
            const providerUserId = req.user.userId;
            const data = await this._providerServiceUseCase.execute(providerUserId);

            res.status(OK).json({
                success: true,
                serviceData: data
            });

        } catch (error) {
            next(error);
        }
    }

    async providerInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }
            const providerUserId = req.user.userId;

            const data = await this._providerServiceInfoUseCase.execute(providerUserId);

            res.status(OK).json({
                success: true,
                providerData: data
            });

        } catch (error) {
            next(error);
        }
    }

    async updateProviderData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }
            const { serviceCharge, category } = req.body;
            const providerUserId = req.user.userId;
            const data = await this._providerDataUpdateUseCase.execute({ providerUserId, serviceCharge, category });

            res.status(OK).json({
                success: true,
                updatedProviderData: data
            });

        } catch (error) {
            next(error);
        }
    }

    //availability
    async getAvailabilityTime(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }
            const providerUserId = req.user.userId;

            let mappedData = await this._getAvailabilityUseCase.execute(providerUserId);

            res.status(OK).json({
                success: true,
                message: "Availability fetched successfully",
                availabilityData: mappedData,
            });

        } catch (error) {
            next(error);
        }
    }

    async scheduleAvailabilityTime(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { schedule } = req.body;
            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }
            const providerUserId = req.user.userId;

            let mappedData = await this._setAvailabilityUseCase.execute({ schedule, providerUserId });

            res.status(OK).json({
                success: true,
                message: "SucessFull",
                availabilityData: mappedData,
            });

        } catch (error) {
            next(error);
        }
    }

    async toggleAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { day, leaveOption } = req.body;

            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }
            const providerUserId = req.user.userId;

            await this._toggleAvailabilityUseCase.execute({ day, providerUserId, leaveOption });

            res.status(OK).json({
                success: true,
                message: "status updated",
            });

        } catch (error) {
            next(error);
        }
    }

    //sales
    async generateSalesReport(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { filter: preset, startDate, endDate } = req.query as {
                filter?: SalesPreset;
                startDate?: string;
                endDate?: string;
            };

            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }
            const providerUserId = req.user.userId;

            let data = await this._getSalesReportUseCase.execute({ providerUserId, preset, startDate, endDate });

            res.status(OK).json({
                success: true,
                message: "status updated",
                salesReport: data
            });

        } catch (error) {
            next(error);
        }
    }

}