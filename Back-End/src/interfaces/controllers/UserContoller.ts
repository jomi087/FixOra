import { NextFunction, Request, Response } from "express";
import { IVerifyPasswordUseCase } from "../../application/Interface/useCases/Client/IVerifyPasswordUseCase.js";
import validateFile from "../validations/fileValidation.js";
import { IImageUploaderService } from "../../domain/interface/ServiceInterface/IImageUploaderService.js";
import { KYCInputDTO } from "../../application/DTO's/KYCDTO.js";
import { IKYCRequestUseCase } from "../../application/Interface/useCases/Client/IKYCRequestUseCase.js";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../shared/Messages.js";
import { IGetActiveProvidersUseCase } from "../../application/Interface/useCases/Client/IGetActiveProvidersUseCase.js";
import { IUpdateProfileUseCase } from "../../application/Interface/useCases/Client/IUpdateProfileUseCase.js";
import { IProviderBookingsInfoUseCase } from "../../application/Interface/useCases/Client/IProviderBookingsInfoUseCase.js";
import { IBookingUseCase } from "../../application/Interface/useCases/Client/IBookingUseCase.js";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService.js";
import { ICreatePaymentUseCase } from "../../application/Interface/useCases/Client/ICreatePaymentUseCase.js";
import { IActiveServiceUseCase } from "../../application/Interface/useCases/Client/IActiveServiceUseCase.js";
import { IResetPasswordUseCase } from "../../application/Interface/useCases/Auth/IResetPasswordUseCase.js";
import { IVerifyPaymentUseCase } from "../../application/Interface/useCases/Client/IVerifyPaymentUseCase.js";

const { OK, BAD_REQUEST,NOT_FOUND,UNAUTHORIZED,UNPROCESSABLE_ENTITY } = HttpStatusCode;
const { UNAUTHORIZED_MSG, IMAGE_VALIDATION_ERROR, USER_NOT_FOUND, FIELD_REQUIRED, KYC_REQUEST_STATUS,
    VERIFICATION_MAIL_SENT,PROFILE_UPDATED_SUCCESS, ADD_ADDRESS,SUBMITTED_BOOKING_REQUEST } = Messages;


export class UserController {
    constructor(
        private _loggerService: ILoggerService,
        private _activeServiceUseCase: IActiveServiceUseCase,
        private _getActiveProvidersUseCase : IGetActiveProvidersUseCase,
        private _kycRequestUseCase: IKYCRequestUseCase,
        private _imageUploaderService: IImageUploaderService, 
        private _providerBookingsInfoUseCase: IProviderBookingsInfoUseCase,
        private _bookingUseCase: IBookingUseCase,
        private _createPaymentUseCase: ICreatePaymentUseCase,
        private _verifyPaymentUseCase: IVerifyPaymentUseCase,
        private _updateProfileUseCase: IUpdateProfileUseCase,
        private _verifyPasswordUseCase: IVerifyPasswordUseCase,
        private _resetPasswordUseCase: IResetPasswordUseCase,
    ) { }

    async activeServices(req: Request, res: Response, next: NextFunction): Promise<void> { 
        try {
            const servicesData = await this._activeServiceUseCase.execute()

            res.status(OK).json({
                success: true,
                servicesData
            })
        } catch (error:any) {
            this._loggerService.error(`activeServices error:, ${error.message}`,{stack : error.stack});
            next(error);
        }
    }

    async activeProviders(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {
                searchQuery = "", filter="",
                currentPage = 1, itemsPerPage = 16,
                selectedService, nearByFilter,
                ratingFilter, availabilityFilter
            } = req.query;

            const user = req.user
            if (!user) throw { status: BAD_REQUEST, message: USER_NOT_FOUND }
            if(!user.location || !user.location.coordinates) throw { status : UNPROCESSABLE_ENTITY , message : ADD_ADDRESS }
            
            const result = await this._getActiveProvidersUseCase.execute({
                searchQuery: String(searchQuery),
                filter: String(filter),
                currentPage: Number(currentPage),
                limit: Number(itemsPerPage),
                extraFilter : {
                    selectedService: selectedService ? String(selectedService) : undefined,
                    nearByFilter: nearByFilter ? String(nearByFilter) : undefined,
                    ratingFilter: ratingFilter ? Number(ratingFilter) : undefined,
                    availabilityFilter: availabilityFilter ? String(availabilityFilter) : undefined,
                },
                coordinates : user.location.coordinates
            })

            res.status(OK).json({
                success: true,
                providerData: result.data,
                total: result.total
            });

        } catch (error : any) {
            this._loggerService.error(`activeProviders error:, ${error.message}`,{stack : error.stack});
            next(error);
        }
    }

    async kycApplication(req: Request, res: Response, next: NextFunction): Promise<void> { 
        try {
            const userId = req.user?.userId;
            if (!userId) throw { status : NOT_FOUND, message : USER_NOT_FOUND }

            const files = req.files as { [fieldname: string]: Express.Multer.File[] }
            
            const requiredFields = ["profileImage", "idCard", "educationCertificate"]
            for (const field of requiredFields) {
                if (!files?.[field] || files[field].length === 0) {
                    throw { status : BAD_REQUEST, message : FIELD_REQUIRED }
                }
            }

            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
            const maxSizeMB = 5

            for (const field in files) {
                for (const file of files[field]) {
                    const validationError = validateFile(file, allowedTypes, maxSizeMB);
                    if (validationError) {
                        throw { status : BAD_REQUEST, message : IMAGE_VALIDATION_ERROR }
                    }
                }
            }

            const name = `${req.user?.fname}_${req.user?.lname}_Date.now()`

            const profileImageUrl = await this._imageUploaderService.uploadImage(files.profileImage[0].buffer,`FixOra/Provider/${name}`);
            const idCardUrl =  await this._imageUploaderService.uploadImage(files.idCard[0].buffer,`FixOra/Provider/${name}`);
            const educationCertificateUrl = await this._imageUploaderService.uploadImage(files.educationCertificate[0].buffer, `FixOra/Provider/${name}`);

            const experienceCertificateUrl = files?.experienceCertificate?.[0] ?
            await this._imageUploaderService.uploadImage(files.experienceCertificate[0].buffer,`FixOra/Provider/${name}`) : undefined;

              const { dob, gender, service, specialization, serviceCharge } = req.body;

            const kycData: KYCInputDTO = {
                userId,
                dob,
                gender,
                serviceId: service,
                specializationIds: specialization, 
                profileImage: profileImageUrl,
                serviceCharge: Number(serviceCharge),
                kyc: {
                    idCard: idCardUrl,
                    certificate: {
                        education: educationCertificateUrl,
                        experience: experienceCertificateUrl,
                    },
                },
            };

            const result = await this._kycRequestUseCase.execute(kycData)

            res.status(OK).json({
                success: true,
                message: KYC_REQUEST_STATUS(result)
            })
            
        } catch (error : any) {
            this._loggerService.error(`kycApplication error:, ${error.message}`,{stack : error.stack});
            next(error);
        }
    }

    async providerBookings(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const { id } = req.params

            const user = req.user
            if (!user) throw { status: BAD_REQUEST, message: USER_NOT_FOUND }
            if (!user.location || !user.location.coordinates) throw { status: UNPROCESSABLE_ENTITY, message: ADD_ADDRESS }
            
            const result = await this._providerBookingsInfoUseCase.execute({
                id,
                coordinates: user.location.coordinates
            })

            res.status(OK).json({
                success: true,
                providerBookingsInfoData : result
            });

        } catch (error : any) {
            this._loggerService.error(`providerBookings error:, ${error.message}`,{stack : error.stack});   
            next(error);
        }
    }

    async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { providerId,providerUserId,scheduledAt,issueTypeId,issue } = req.body
            
            const user = req.user
            if (!user?.userId) throw { status: BAD_REQUEST, message: USER_NOT_FOUND }
            if (!user.location || !user.location.coordinates) throw { status: UNPROCESSABLE_ENTITY, message: ADD_ADDRESS }

            const userId = user.userId

            const booking = await this._bookingUseCase.execute({
                userId, providerUserId, providerId,
                scheduledAt, issueTypeId, issue,
                coordinates: user.location.coordinates
            })
            
            res.status(200).json({
                message: SUBMITTED_BOOKING_REQUEST,
                booking
            });

        } catch (error : any) {
            this._loggerService.error(`createBooking error:, ${error.message}`,{stack : error.stack}); 
            next(error);
        }
    }

    async initiatePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bookingId } = req.body
            const sessionId = await this._createPaymentUseCase.execute(bookingId)
            
            res.status(OK).json(
               sessionId
            )

        } catch (error : any) {
            this._loggerService.error(`initiatePayment error:, ${error.message}`,{stack : error.stack}); 
            next(error);
        }
    }

    async verifyPaymentViaWebHook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("i was called by strip")
            const sig = req.headers["stripe-signature"] as string;
            const rawBody = (req as any).body;

            await this._verifyPaymentUseCase.execute(rawBody,sig)
                  
            res.status(200).send('Webhook received'); //to notify stripe

        } catch (error : any) {
            this._loggerService.error(`payment verification error:,${error.message}`,{stack : error.stack}); 
            next(error);
        }
    }
    
    async editProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
           
            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }

            const userId = req.user.userId
            const profileData = req.body

            const updatedUser = await this._updateProfileUseCase.execute({ userId,profileData })

            res.status(OK).json({
                success: true,
                message: PROFILE_UPDATED_SUCCESS ,
                user : updatedUser
            })
    
        } catch (error : any) {
            this._loggerService.error(`editProfile error:, ${error.message}`, { stack: error.stack }); 
            next(error);
        }
    }

    async verifyPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { password } = req.body

            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }
            const userId = req.user.userId
            await this._verifyPasswordUseCase.execute(password,userId)  

            res.status(OK).json({
                success: true,
                message: VERIFICATION_MAIL_SENT ,
            })
        } catch (error : any) {
            this._loggerService.error(`verifyPassword error:, ${error.message}`,{stack : error.stack}); 
            next(error);
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { token, password } = req.body
        
            await this._resetPasswordUseCase.execute(token, password)
            
            res.status(OK).json({
                success: true,
                message: VERIFICATION_MAIL_SENT
            });

        } catch (error : any) {
            this._loggerService.error(`changePassword error:, ${error.message}`,{stack : error.stack}); 
            next(error);
        }
    }

}