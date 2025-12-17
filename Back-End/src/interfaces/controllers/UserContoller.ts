import { NextFunction, Request, Response } from "express";
import { IVerifyPasswordUseCase } from "../../application/Interface/useCases/Client/IVerifyPasswordUseCase";
import validateFile from "../validations/fileValidation";
import { IKYCRequestUseCase } from "../../application/Interface/useCases/Client/IKYCRequestUseCase";
import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";
import { Messages } from "../../shared/const/Messages";
import { IGetActiveProvidersUseCase } from "../../application/Interface/useCases/Client/IGetActiveProvidersUseCase";
import { IUpdateProfileUseCase } from "../../application/Interface/useCases/Client/IUpdateProfileUseCase";
import { IProviderInfoUseCase } from "../../application/Interface/useCases/Client/IProviderInfoUseCase";
import { IBookingUseCase } from "../../application/Interface/useCases/Client/IBookingUseCase";
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
import { IAddReviewUseCase } from "../../application/Interface/useCases/Client/IAddReviewUseCase";
import { IReviewStatusUseCase } from "../../application/Interface/useCases/Client/IReviewStatusUseCase";
import { IGetProviderReviewsUseCase } from "../../application/Interface/useCases/Client/IGetProviderReviewsUseCase";
import { IUpdateReviewUseCase } from "../../application/Interface/useCases/Client/IUpdateReviewUseCase";
import { ICreateDisputeAndNotifyUseCase } from "../../application/Interface/useCases/Client/ICreateDisputeAndNotifyUseCase";
import { DisputeType } from "../../shared/enums/Dispute";
import { IRescheduleBookingUseCase } from "../../application/Interface/useCases/Client/IRescheduleBookingUseCase";
import { IUpdateSelectedLocationUseCase } from "../../application/Interface/useCases/Client/IUpdateSelectedLocationUseCase";
import { IRequestEmailUpdateUseCase } from "../../application/Interface/useCases/Client/IRequestEmailUpdateUseCase";
import { IConfirmEmailUpdateUseCase } from "../../application/Interface/useCases/Client/IConfirmEmailUpdateUseCase";
import { AppError } from "../../shared/errors/AppError";

const { OK, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, UNPROCESSABLE_ENTITY, CONFLICT, GONE } = HttpStatusCode;
const { UNAUTHORIZED_MSG, IMAGE_VALIDATION_ERROR, FIELD_REQUIRED, KYC_REQUEST_STATUS,
    VERIFICATION_MAIL_SENT, PROFILE_UPDATED_SUCCESS, ADD_ADDRESS,
    SUBMITTED_BOOKING_REQUEST, NOT_FOUND_MSG } = Messages;


export class UserController {
    constructor(
        private _activeServiceUseCase: IActiveServiceUseCase,
        private _getActiveProvidersUseCase: IGetActiveProvidersUseCase,
        private _updateSelectedLocationUseCase: IUpdateSelectedLocationUseCase,
        private _kycRequestUseCase: IKYCRequestUseCase,
        private _providerInfoUseCase: IProviderInfoUseCase,
        private _getProviderReviewsUseCase: IGetProviderReviewsUseCase,
        private _updateReviewUseCase: IUpdateReviewUseCase,
        private _createDisputeAndNotifyUseCase: ICreateDisputeAndNotifyUseCase,
        private _bookingUseCase: IBookingUseCase,
        private _rescheduleBookingUseCase: IRescheduleBookingUseCase,
        private _createPaymentUseCase: ICreatePaymentUseCase,
        private _walletPaymentUseCase: IWalletPaymentUseCase,
        private _verifyPaymentUseCase: IVerifyPaymentUseCase,
        private _requestEmailUpdateUseCase: IRequestEmailUpdateUseCase,
        private _confirmEmailUpdateUseCase: IConfirmEmailUpdateUseCase,
        private _updateProfileUseCase: IUpdateProfileUseCase,
        private _verifyPasswordUseCase: IVerifyPasswordUseCase,
        private _resetPasswordUseCase: IResetPasswordUseCase,
        private _bookingHistoryUseCase: IBookingHistoryUseCase,
        private _getBookingDetailsUseCase: IGetBookingDetailsUseCase,
        private _retryAvailabilityUseCase: IRetryAvailabilityUseCase,
        private _reviewStatusUseCase: IReviewStatusUseCase,
        private _cancelBookingUseCase: ICancelBookingUseCase,
        private _addReviewUseCase: IAddReviewUseCase,
        private _getUserwalletInfoUseCase: IGetUserwalletInfoUseCase,
        private _walletTopUpUseCase: IWalletTopUpUseCase,
    ) { }

    //Service
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


    //provider
    async activeProviders(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {
                searchQuery = "", filter = "",
                currentPage = 1, itemsPerPage = 16,
                selectedService, nearByFilter,
                ratingFilter, availabilityFilter,
            } = req.query;

            const user = req.user;
            if (!user) throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);

            if (!user.location || !user.location.coordinates) throw new AppError(UNPROCESSABLE_ENTITY, ADD_ADDRESS);

            let parsedCoordinates = {
                latitude: user.location.coordinates.latitude,
                longitude: user.location.coordinates.longitude
            };

            // if (coordinates) {
            //     const coords = JSON.parse(coordinates as string);
            //     parsedCoordinates = {
            //         latitude: Number(coords.latitude),
            //         longitude: Number(coords.longitude)
            //     };
            // }

            if (user.selectedLocation) {
                parsedCoordinates = {
                    latitude: user.selectedLocation.lat,
                    longitude: user.selectedLocation.lng
                };
            }

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
                coordinates: parsedCoordinates
            });

            res.status(OK).json({
                success: true,
                providerData: result.data,
                total: result.total,
                selectedAddress: user.selectedLocation?.address ?? null
            });

        } catch (error) {
            next(error);
        }
    }

    async providerInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            const user = req.user;
            if (!user) throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            if (!user.location || !user.location.coordinates) throw new AppError(UNPROCESSABLE_ENTITY, ADD_ADDRESS);

            let location = {
                latitude: user.location.coordinates.latitude,
                longitude: user.location.coordinates.longitude
            };

            if (user.selectedLocation) {
                location = {
                    latitude: user.selectedLocation.lat,
                    longitude: user.selectedLocation.lng
                };
            }

            const result = await this._providerInfoUseCase.execute({
                id,
                coordinates: location
            });

            res.status(OK).json({
                success: true,
                providerInfoData: result
            });

        } catch (error) {
            next(error);
        }
    }

    //location
    async saveLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            const { address, lat, lng } = req.body;

            await this._updateSelectedLocationUseCase.execute({
                userId,
                location: {
                    address,
                    lat,
                    lng
                }
            });

            res.status(OK).json({
                success: true
            });

        } catch (error) {
            next(error);
        }
    }

    //kyc
    async kycApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);

            const { dob, gender, service, specialization, serviceCharge } = req.body;

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const requiredFields = ["profileImage", "idCard", "educationCertificate"];
            for (const field of requiredFields) {
                if (!files?.[field] || files[field].length === 0) {
                    throw new AppError(BAD_REQUEST, FIELD_REQUIRED);
                }
            }

            for (const field in files) {
                for (const file of files[field]) {
                    const validationError = validateFile(file, allowedTypes, maxSizeMB);
                    if (validationError) {
                        throw new AppError(BAD_REQUEST, validationError || IMAGE_VALIDATION_ERROR);
                    }
                }
            }

            const dtoFiles = Object.entries(files).reduce((acc, [key, value]) => {
                acc[key] = value.map(f => ({
                    fieldName: f.fieldname,
                    originalName: f.originalname,
                    buffer: f.buffer,
                }));
                return acc;
            }, {} as Record<string, { fieldName: string; originalName: string; buffer: Buffer }[]>);

            const result = await this._kycRequestUseCase.execute({
                userId,
                name: `${req.user?.fname}_${req.user?.lname}`,
                dob,
                gender,
                serviceId: service,
                specializationIds: specialization,
                serviceCharge: Number(serviceCharge),
                files: dtoFiles,
            });

            res.status(OK).json({
                success: true,
                message: KYC_REQUEST_STATUS(result)
            });

        } catch (error) {
            next(error);
        }
    }


    //review
    async providerReview(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: providerId } = req.params;

            const currentPage = parseInt(req.query.currentPage as string) || 1;
            const limit = parseInt(req.query.itemsPerPage as string) || 6;

            const result = await this._getProviderReviewsUseCase.execute({ providerId, currentPage, limit });

            res.status(OK).json({
                success: true,
                providerReviewData: result.data,
                totalPages: result.total,
            });

        } catch (error) {
            next(error);
        }
    }

    async updatedReview(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { ratingId, rating, feedback } = req.body;
            let data = await this._updateReviewUseCase.execute({ ratingId, rating, feedback });
            res.status(OK).json({
                success: true,
                updatedReviewData: data
            });

        } catch (error) {
            next(error);
        }
    }

    async createReviewDispute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }
            const userId = req.user.userId;
            const disputeType = DisputeType.REVIEW;
            const { ratingId: contextId, reason } = req.body;
            await this._createDisputeAndNotifyUseCase.execute({ userId, disputeType, contextId, reason });

            res.status(OK).json({
                success: true,
            });

        } catch (error) {
            next(error);
        }
    }

    async reviewStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { bookingId } = req.params;
            if (!bookingId) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));
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

    async addReview(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bookingId, rating, feedback } = req.body;

            await this._addReviewUseCase.execute({ bookingId, rating, feedback });

            res.status(OK).json({
                success: true,
                message: "successfull",
            });

        } catch (error) {
            next(error);
        }
    }

    //booking
    async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { providerId, providerUserId, scheduledAt, issueTypeId, issue } = req.body;

            const user = req.user;
            if (!user?.userId) throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);

            if (!user.location || !user.location.coordinates) throw new AppError(UNPROCESSABLE_ENTITY, ADD_ADDRESS);
            const userId = user.userId;

            let location: { latitude: number; longitude: number };
            let address: string;

            if (user.selectedLocation) {

                address = user.selectedLocation.address;
                location = {
                    latitude: user.selectedLocation.lat,
                    longitude: user.selectedLocation.lng
                };

            } else {

                const formatedAddress = [
                    user.location.houseinfo,
                    user.location.street,
                    user.location.locality,
                    user.location.city,
                    user.location.district,
                    user.location.state,
                    user.location.postalCode
                ].filter(Boolean).join(", ");

                address = formatedAddress;
                location = {
                    latitude: user.location.coordinates.latitude,
                    longitude: user.location.coordinates.longitude
                };
            }


            const booking = await this._bookingUseCase.execute({
                userId, providerUserId, providerId,
                scheduledAt, issueTypeId, issue,
                address,
                coordinates: location
            });

            res.status(200).json({
                message: SUBMITTED_BOOKING_REQUEST,
                booking
            });

        } catch (error) {
            next(error);
        }
    }

    async rescheduleBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { rescheduledAt } = req.body;
            const bookingId = req.params.bookingId as string;

            const data = await this._rescheduleBookingUseCase.execute({ bookingId, rescheduledAt });

            res.status(200).json({
                success: true,
                rescheduledAt: data
            });

        } catch (error) {
            next(error);
        }
    }

    async getBookingHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
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
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));
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
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }

            const userId = req.user.userId;

            const { bookingId } = req.params;
            if (!bookingId) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));
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
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }

            const userId = req.user.userId;

            const { bookingId } = req.params;
            if (!bookingId) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));
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

    //payment
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
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }
            const userId = req.user.userId;

            const { bookingId } = req.body;

            const result = await this._walletPaymentUseCase.execute({ userId, bookingId });

            res.status(OK).json({
                result
            });

        } catch (error) {
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

    async walletInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
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
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
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

    //profile
    async requestEmailUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }
            const currentEmail = req.user.email!;
            const { email: newEmail } = req.body;

            await this._requestEmailUpdateUseCase.execute({ currentEmail, newEmail });

            res.status(OK).json({
                success: true,
            });

        } catch (error) {
            next(error);
        }
    }

    async confirmEmailUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }
            const currentEmail = req.user.email!;
            const userId = req.user.userId;

            const { otp, newEmail } = req.body;
            await this._confirmEmailUpdateUseCase.execute({ userId, otp, currentEmail, newEmail });

            res.status(OK).json({
                success: true,
            });

        } catch (error) {
            next(error);
        }
    }

    async editProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
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
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
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


}