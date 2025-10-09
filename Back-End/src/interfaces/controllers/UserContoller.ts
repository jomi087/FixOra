import { NextFunction, Request, Response } from "express";
import { IVerifyPasswordUseCase } from "../../application/Interface/useCases/Client/IVerifyPasswordUseCase";
import validateFile from "../validations/fileValidation";
import { IImageUploaderService } from "../../domain/interface/ServiceInterface/IImageUploaderService";
import { KYCInputDTO } from "../../application/DTOs/KYCDTO";
import { IKYCRequestUseCase } from "../../application/Interface/useCases/Client/IKYCRequestUseCase";
import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";
import { Messages } from "../../shared/const/Messages";
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
import { ICancelBookingUseCase } from "../../application/Interface/useCases/Client/ICancelBookingUseCase";
import { IRetryAvailabilityUseCase } from "../../application/Interface/useCases/Client/IRetryAvailabilityUseCase";
import { allowedTypes, maxSizeMB } from "../../shared/const/constants";
import { IAddFeedbackUseCase } from "../../application/Interface/useCases/Client/IAddFeedbackUseCase";
import { IReviewStatusUseCase } from "../../application/Interface/useCases/Client/IReviewStatusUseCase";
import { IGetProviderReviewsUseCase } from "../../application/Interface/useCases/Client/IGetProviderReviewsUseCase";

const { OK, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, UNPROCESSABLE_ENTITY, CONFLICT, GONE } = HttpStatusCode;
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
        private _getProviderReviewsUseCase: IGetProviderReviewsUseCase,
        private _bookingUseCase: IBookingUseCase,
        private _createPaymentUseCase: ICreatePaymentUseCase,
        private _walletPaymentUseCase: IWalletPaymentUseCase,
        private _verifyPaymentUseCase: IVerifyPaymentUseCase,
        private _updateProfileUseCase: IUpdateProfileUseCase,
        private _verifyPasswordUseCase: IVerifyPasswordUseCase,
        private _resetPasswordUseCase: IResetPasswordUseCase,
        private _bookingHistoryUseCase: IBookingHistoryUseCase,
        private _getBookingDetailsUseCase: IGetBookingDetailsUseCase,
        private _retryAvailabilityUseCase: IRetryAvailabilityUseCase,
        private _reviewStatusUseCase: IReviewStatusUseCase,
        private _cancelBookingUseCase: ICancelBookingUseCase,
        private _addFeedbackUseCase: IAddFeedbackUseCase,
        private _getUserwalletInfoUseCase: IGetUserwalletInfoUseCase,
        private _walletTopUpUseCase: IWalletTopUpUseCase,
    ) { }

    async activeServices(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const servicesData = await this._activeServiceUseCase.execute();

            res.status(OK).json({
                success: true,
                servicesData
            });
        } catch (error) {
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

        } catch (error) {
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

            for (const field in files) {
                for (const file of files[field]) {
                    const validationError = validateFile(file, allowedTypes, maxSizeMB);
                    if (validationError) {
                        throw { status: BAD_REQUEST, message: validationError || IMAGE_VALIDATION_ERROR };
                    }
                }
            }

            const name = `${req.user?.fname}_${req.user?.lname}_${Date.now()}`;

            const profileImageId = await this._imageUploaderService.uploadImage(files.profileImage[0].buffer, `FixOra/Provider/${name}`);
            const idCardId = await this._imageUploaderService.uploadImage(files.idCard[0].buffer, `FixOra/Provider/${name}`);
            const educationCertificateId = await this._imageUploaderService.uploadImage(files.educationCertificate[0].buffer, `FixOra/Provider/${name}`);

            const experienceCertificateId = files?.experienceCertificate?.[0] ?
                await this._imageUploaderService.uploadImage(files.experienceCertificate[0].buffer, `FixOra/Provider/${name}`) : undefined;

            // let plainFiles:FileData[] = [];
            // for (let key in files) {
            //     if (Array.isArray(files[key])) { // only process arrays, skip "length"
            //         plainFiles = plainFiles.concat(
            //             files[key].map(file => ({
            //                 buffer: file.buffer,
            //                 originalname: file.originalname
            //             }))
            //         );
            //     }
            // }


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

        } catch (error) {
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

        } catch (error) {
            next(error);
        }
    }

    async providerReview(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id:providerId } = req.params;

            const currentPage = parseInt(req.query.currentPage as string) || 1;
            const limit = parseInt(req.query.itemsPerPage as string) || 6;

            const result = await this._getProviderReviewsUseCase.execute({ providerId, currentPage, limit });

            res.status(OK).json({
                success: true,
                providerReviewData: result.data,
                totalPages : result.total,
            });

        } catch (error) {
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

        } catch (error) {
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

        } catch (error) {
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

            // await this.sendBookingConfirmedNotificationUseCase.execute(result.bookingId);


            res.status(OK).json({
                result
            });

        } catch (error) {
            console.log(error);
            next(error);
        }
    }


    async verifyPaymentViaWebHook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sig = req.headers["stripe-signature"] as string;
            const rawBody = req.body;

            await this._verifyPaymentUseCase.execute(rawBody, sig);

            res.status(OK).send("Webhook received"); //to notify stripe

        } catch (error) {
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

        } catch (error) {
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
        } catch (error) {
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

        } catch (error) {
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

        } catch (error) {
            next(error);
        }
    }

    async bookingDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
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
        } catch (error) {
            next(error);
        }
    }

    async retryAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }

            const userId = req.user.userId;

            const { bookingId } = req.params;
            if (!bookingId) {
                throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };
            }

            const result = await this._retryAvailabilityUseCase.execute({ userId, bookingId });

            if (result === null) {
                res.status(OK).json({ success: true });
                return;
            }

            if (result.reason === Messages.SLOT_TIME_PASSED) {
                res.status(GONE).json({
                    success: true,
                    booking: result
                });
                return;
            }

            if (result.reason === Messages.ALREDY_BOOKED) {
                res.status(CONFLICT).json({
                    success: true,
                    booking: result
                });
                return;
            }

        } catch (error) {
            next(error);
        }
    }

    async cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }

            const userId = req.user.userId;

            const { bookingId } = req.params;
            if (!bookingId) {
                throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };
            }

            const data = await this._cancelBookingUseCase.execute({ userId, bookingId });

            res.status(OK).json({
                success: true,
                message: "Booking Cancelled, Fund has been Refunded to Wallet",
                bookingStatus: data.status,
                refundInfo: data.paymentInfo
            });

        } catch (error) {
            next(error);
        }
    }

    async reviewStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { bookingId } = req.params;
            if (!bookingId) {
                throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };
            }


            const reviewStatus = await this._reviewStatusUseCase.execute(bookingId);

            res.status(OK).json({
                success: true,
                message: reviewStatus,
                reviewStatus
            });

        } catch (error) {
            next(error);
        }
    };

    async addFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            //console.log(req.body);
            const { bookingId, rating, feedback } = req.body;

            await this._addFeedbackUseCase.execute({ bookingId, rating, feedback });

            res.status(OK).json({
                success: true,
                message: "successfull",
            });

        } catch (error) {
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

        } catch (error) {
            next(error);
        }
    }

    async addFund(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.userId;
            const role = req.user?.role;

            if (!userId || !role) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }

            const { amount } = req.body;

            const sessionId = await this._walletTopUpUseCase.execute({ userId, role, amount });

            res.status(OK).json(
                sessionId
            );

        } catch (error) {
            next(error);
        }
    }

}