import { NextFunction, Request, Response } from "express";
import { IVerifyPasswordUseCase } from "../../application/Interface/useCases/Client/IVerifyPasswordUseCase";
import validateFile from "../validations/fileValidation";
import { IImageUploaderService } from "../../domain/interface/ServiceInterface/IImageUploaderService";
import { KYCInputDTO } from "../../application/DTO's/KYCDTO";
import { IKYCRequestUseCase } from "../../application/Interface/useCases/Client/IKYCRequestUseCase";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode";
import { Messages } from "../../shared/Messages";
import { IGetActiveProvidersUseCase } from "../../application/Interface/useCases/Client/IGetActiveProvidersUseCase";
import { IUpdateProfileUseCase } from "../../application/Interface/useCases/Client/IUpdateProfileUseCase";
import { IProviderInfoUseCase } from "../../application/Interface/useCases/Client/IProviderInfoUseCase";
import { IBookingUseCase } from "../../application/Interface/useCases/Client/IBookingUseCase";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService";
import { ICreatePaymentUseCase } from "../../application/Interface/useCases/Client/ICreatePaymentUseCase";
import { IActiveServiceUseCase } from "../../application/Interface/useCases/Client/IActiveServiceUseCase";
import { IResetPasswordUseCase } from "../../application/Interface/useCases/Auth/IResetPasswordUseCase";
import { IVerifyPaymentUseCase } from "../../application/Interface/useCases/Client/IVerifyPaymentUseCase";
import { IBookingHistoryUseCase } from "../../application/Interface/useCases/Client/IBookingHistoryUseCase";
import { IGetBookingDetailsUseCase } from "../../application/Interface/useCases/Client/IGetBookingDetailsUseCase";
import { IWalletTopUpUseCase } from "../../application/Interface/useCases/Client/IWalletTopUpUseCase";
import { IGetUserwalletInfoUseCase } from "../../application/Interface/useCases/Client/IGetUserwalletInfoUseCase";
import { IWalletPaymentUseCase } from "../../application/Interface/useCases/Client/IWalletPaymentUseCase";

const { OK, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, UNPROCESSABLE_ENTITY } = HttpStatusCode;
const { UNAUTHORIZED_MSG, IMAGE_VALIDATION_ERROR, USER_NOT_FOUND, FIELD_REQUIRED, KYC_REQUEST_STATUS,
    VERIFICATION_MAIL_SENT, PROFILE_UPDATED_SUCCESS, ADD_ADDRESS,
    SUBMITTED_BOOKING_REQUEST, BOOKING_ID_NOT_FOUND } = Messages;


export class UserController {
    constructor(
        private _loggerService: ILoggerService,
        private _activeServiceUseCase: IActiveServiceUseCase,
        private _getActiveProvidersUseCase: IGetActiveProvidersUseCase,
        private _kycRequestUseCase: IKYCRequestUseCase,
        private _imageUploaderService: IImageUploaderService,
        private _providerInfoUseCase: IProviderInfoUseCase,
        private _bookingUseCase: IBookingUseCase,
        private _createPaymentUseCase: ICreatePaymentUseCase,
        private _walletPaymentUseCase: IWalletPaymentUseCase,
        private _verifyPaymentUseCase: IVerifyPaymentUseCase,
        private _updateProfileUseCase: IUpdateProfileUseCase,
        private _verifyPasswordUseCase: IVerifyPasswordUseCase,
        private _resetPasswordUseCase: IResetPasswordUseCase,
        private _bookingHistoryUseCase: IBookingHistoryUseCase,
        private _getBookingDetailsUseCase: IGetBookingDetailsUseCase,
        private _getUserwalletInfoUseCase: IGetUserwalletInfoUseCase,
        private _walletTopUpUseCase: IWalletTopUpUseCase
    ) { }

    async activeServices(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const servicesData = await this._activeServiceUseCase.execute();

            res.status(OK).json({
                success: true,
                servicesData
            });
        } catch (error: any) {
            this._loggerService.error(`activeServices error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async activeProviders(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {
                searchQuery = "", filter = "",
                currentPage = 1, itemsPerPage = 16,
                selectedService, nearByFilter,
                ratingFilter, availabilityFilter
            } = req.query;

            const user = req.user;
            if (!user) throw { status: BAD_REQUEST, message: USER_NOT_FOUND };
            if (!user.location || !user.location.coordinates) throw { status: UNPROCESSABLE_ENTITY, message: ADD_ADDRESS };

            const result = await this._getActiveProvidersUseCase.execute({
                searchQuery: String(searchQuery),
                filter: String(filter),
                currentPage: Number(currentPage),
                limit: Number(itemsPerPage),
                extraFilter: {
                    selectedService: selectedService ? String(selectedService) : undefined,
                    nearByFilter: nearByFilter ? String(nearByFilter) : undefined,
                    ratingFilter: ratingFilter ? Number(ratingFilter) : undefined,
                    availabilityFilter: availabilityFilter ? String(availabilityFilter) : undefined,
                },
                coordinates: user.location.coordinates
            });

            res.status(OK).json({
                success: true,
                providerData: result.data,
                total: result.total
            });

        } catch (error: any) {
            this._loggerService.error(`activeProviders error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async kycApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) throw { status: NOT_FOUND, message: USER_NOT_FOUND };

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const requiredFields = ["profileImage", "idCard", "educationCertificate"];
            for (const field of requiredFields) {
                if (!files?.[field] || files[field].length === 0) {
                    throw { status: BAD_REQUEST, message: FIELD_REQUIRED };
                }
            }

            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            const maxSizeMB = 5;

            for (const field in files) {
                for (const file of files[field]) {
                    const validationError = validateFile(file, allowedTypes, maxSizeMB);
                    if (validationError) {
                        throw { status: BAD_REQUEST, message: IMAGE_VALIDATION_ERROR };
                    }
                }
            }

            const name = `${req.user?.fname}_${req.user?.lname}_${Date.now()}`;

            const profileImageId = await this._imageUploaderService.uploadImage(files.profileImage[0].buffer, `FixOra/Provider/${name}`);
            const idCardId = await this._imageUploaderService.uploadImage(files.idCard[0].buffer, `FixOra/Provider/${name}`);
            const educationCertificateId = await this._imageUploaderService.uploadImage(files.educationCertificate[0].buffer, `FixOra/Provider/${name}`);

            const experienceCertificateId = files?.experienceCertificate?.[0] ?
                await this._imageUploaderService.uploadImage(files.experienceCertificate[0].buffer, `FixOra/Provider/${name}`) : undefined;

            const { dob, gender, service, specialization, serviceCharge } = req.body;

            const kycData: KYCInputDTO = {
                userId,
                dob,
                gender,
                serviceId: service,
                specializationIds: specialization,
                profileImage: profileImageId, 
                serviceCharge: Number(serviceCharge),
                kyc: {
                    idCard: idCardId, 
                    certificate: {
                        education: educationCertificateId, 
                        experience: experienceCertificateId, 
                    },
                },
            };

            const result = await this._kycRequestUseCase.execute(kycData);

            res.status(OK).json({
                success: true,
                message: KYC_REQUEST_STATUS(result)
            });

        } catch (error: any) {
            this._loggerService.error(`kycApplication error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async providerInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            const user = req.user;
            if (!user) throw { status: BAD_REQUEST, message: USER_NOT_FOUND };
            if (!user.location || !user.location.coordinates) throw { status: UNPROCESSABLE_ENTITY, message: ADD_ADDRESS };

            const result = await this._providerInfoUseCase.execute({
                id,
                coordinates: user.location.coordinates
            });

            res.status(OK).json({
                success: true,
                providerInfoData: result
            });

        } catch (error: any) {
            this._loggerService.error(`providerBookings error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { providerId, providerUserId, scheduledAt, issueTypeId, issue } = req.body;

            const user = req.user;
            if (!user?.userId) throw { status: BAD_REQUEST, message: USER_NOT_FOUND };
            if (!user.location || !user.location.coordinates) throw { status: UNPROCESSABLE_ENTITY, message: ADD_ADDRESS };

            const userId = user.userId;

            const booking = await this._bookingUseCase.execute({
                userId, providerUserId, providerId,
                scheduledAt, issueTypeId, issue,
                coordinates: user.location.coordinates
            });

            res.status(200).json({
                message: SUBMITTED_BOOKING_REQUEST,
                booking
            });

        } catch (error: any) {
            this._loggerService.error(`createBooking error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async initiateOnlinePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bookingId } = req.body;
            const sessionId = await this._createPaymentUseCase.execute(bookingId);

            res.status(OK).json(
                sessionId
            );

        } catch (error: any) {
            this._loggerService.error(`initiatePayment error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async initiateWalletPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }
            const userId = req.user.userId;

            const { bookingId } = req.body;

            const result = await this._walletPaymentUseCase.execute({ userId, bookingId });

            res.status(OK).json({
                result
            });

        } catch (error: any) {
            this._loggerService.error(`walletPayment error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }


    async verifyPaymentViaWebHook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sig = req.headers["stripe-signature"] as string;
            const rawBody = (req as any).body;

            await this._verifyPaymentUseCase.execute(rawBody, sig);

            res.status(OK).send("Webhook received"); //to notify stripe

        } catch (error: any) {
            this._loggerService.error(`payment verification error:,${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async editProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }

            const userId = req.user.userId;
            const profileData = req.body;

            const updatedUser = await this._updateProfileUseCase.execute({ userId, profileData });

            res.status(OK).json({
                success: true,
                message: PROFILE_UPDATED_SUCCESS,
                user: updatedUser
            });

        } catch (error: any) {
            this._loggerService.error(`editProfile error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async verifyPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { password } = req.body;

            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }
            const userId = req.user.userId;
            await this._verifyPasswordUseCase.execute(password, userId);

            res.status(OK).json({
                success: true,
                message: VERIFICATION_MAIL_SENT,
            });
        } catch (error: any) {
            this._loggerService.error(`verifyPassword error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { token, password } = req.body;

            await this._resetPasswordUseCase.execute(token, password);

            res.status(OK).json({
                success: true,
                message: VERIFICATION_MAIL_SENT
            });

        } catch (error: any) {
            this._loggerService.error(`changePassword error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async getBookingHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }

            const userId = req.user.userId;

            const currentPage = parseInt(req.query.currentPage as string) || 1;
            const limit = parseInt(req.query.itemsPerPage as string) || 8;

            const result = await this._bookingHistoryUseCase.execute({ userId, currentPage, limit });

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

    async walletInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }
            const userId = req.user.userId;

            const currentPage = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await this._getUserwalletInfoUseCase.execute({ userId, currentPage, limit });

            res.status(OK).json({
                success: true,
                walletInfoData: result.data,
                total: result.total
            });

        } catch (error: any) {
            this._loggerService.error(`bookings error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

    async addFund(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.userId;
            const role = req.user?.role;

            if (!userId || !role ) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }

            const { amount } = req.body;

            const sessionId = await this._walletTopUpUseCase.execute({ userId, role, amount });

            res.status(OK).json(
                sessionId
            );

        } catch (error: any) {
            this._loggerService.error(`bookings error:, ${error.message}`, { stack: error.stack });
            next(error);
        }
    }

}