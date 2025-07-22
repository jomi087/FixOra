import { NextFunction, Request, Response } from "express";
import { ActiveServiceUseCase } from "../../application/useCases/client/ActiveServiceUseCase.js";
import { EditProfileDTO } from "../../application/DTO's/EditProfileDTO.js";
import { UpdateProfileUseCase } from "../../application/useCases/client/UpdateProfileUseCase.js";
import { VerifyPasswordUseCase } from "../../application/useCases/client/VerifyPasswordUseCase.js";
import { ResetPasswordUseCase } from "../../application/useCases/auth/ResetPasswordUseCase.js";
import validateFile from "../utils/fileValidation.js";
import { IImageUploaderService } from "../../domain/interface/ServiceInterface/IImageUploaderService.js";
import { KYCInputDTO } from "../../application/DTO's/KYCInputDTO.js";
import { KYCRequestUseCase } from "../../application/useCases/client/kYCRequestUseCase.js";
import { HttpStatusCode } from "../../shared/constant/HttpStatusCode.js";
import { Messages } from "../../shared/constant/Messages.js";

const { OK, BAD_REQUEST,NOT_FOUND,UNAUTHORIZED } = HttpStatusCode;
const { UNAUTHORIZED_MSG, IMAGE_VALIDATION_ERROR, USER_NOT_FOUND, FIELD_REQUIRED, KYC_REQUEST_STATUS,
    VERIFICATION_MAIL_SENT,PROFILE_UPDATED_SUCCESS } = Messages;


export class UserController {
    constructor(
        private activeServiceUseCase: ActiveServiceUseCase,
        private kycRequestUseCase: KYCRequestUseCase,
        private imageUploaderService: IImageUploaderService, 
        private updateProfileUseCase: UpdateProfileUseCase,
        private verifyPasswordUseCase: VerifyPasswordUseCase,
        private resetPasswordUseCase: ResetPasswordUseCase,
        
    ) { }

    async activeServices(req: Request, res: Response, next: NextFunction): Promise<void> { 
        try {
            const servicesData = await this.activeServiceUseCase.execute()

            res.status(OK).json({
                success: true,
                servicesData
            })

        } catch (error) {
            console.error("editProfile error:", error);
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

            const profileImageUrl = await this.imageUploaderService.uploadImage(files.profileImage[0].buffer,`FixOra/Provider/${name}`);
            const idCardUrl =  await this.imageUploaderService.uploadImage(files.idCard[0].buffer,`FixOra/Provider/${name}`);
            const educationCertificateUrl = await this.imageUploaderService.uploadImage(files.educationCertificate[0].buffer, `FixOra/Provider/${name}`);

            const experienceCertificateUrl = files?.experienceCertificate?.[0] ?
                await this.imageUploaderService.uploadImage(files.experienceCertificate[0].buffer,`FixOra/Provider/${name}`) : undefined;

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

            const result = await this.kycRequestUseCase.execute(kycData)

            res.status(OK).json({
                success: true,
                message: KYC_REQUEST_STATUS(result)
            })
            
        } catch (error) {
            console.error(" error:", error);
            next(error);
        }
    }
    
    async editProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const profileData: EditProfileDTO = req.body
           
            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
            }

            const userId = req.user.userId
            const result = await this.updateProfileUseCase.execute(profileData,userId)

            res.status(OK).json({
                success: true,
                message: PROFILE_UPDATED_SUCCESS ,
                user : result.user 
            })
    
        } catch (error) {
            console.error("editProfile error:", error);
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
            await this.verifyPasswordUseCase.execute(password,userId)  

            res.status(OK).json({
                success: true,
                message: VERIFICATION_MAIL_SENT ,
            })
        } catch (error) {
            console.error("verifyPassword error:", error);
            next(error);
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { token, password } = req.body
        
            await this.resetPasswordUseCase.execute(token, password)
            
            res.status(OK).json({
                success: true,
                message: VERIFICATION_MAIL_SENT
            });

        } catch (error) {
            console.error("changePassword error:", error);
            next(error);
        }
     }

}