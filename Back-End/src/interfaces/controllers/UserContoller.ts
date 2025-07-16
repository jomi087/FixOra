import { NextFunction, Request, Response } from "express";
import { ActiveServiceUseCase } from "../../application/useCases/client/ActiveServiceUseCase.js";
import { EditProfileDTO } from "../../application/InputDTO's/EditProfileDTO.js";
import { UpdateProfileUseCase } from "../../application/useCases/client/UpdateProfileUseCase.js";
import { VerifyPasswordUseCase } from "../../application/useCases/client/VerifyPasswordUseCase.js";
import { ResetPasswordUseCase } from "../../application/useCases/auth/ResetPasswordUseCase.js";
import validateFile from "../utils/fileValidation.js";
import { IImageUploaderService } from "../../domain/interface/ServiceInterface/IImageUploaderService.js";
import { KYCInputDTO } from "../../application/InputDTO's/KYCInputDTO.js";
import { KYCRequestUseCase } from "../../application/useCases/client/kYCRequestUseCase.js";

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

            res.status(200).json({
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
            if (!userId) throw { status : 404, message : `UserNot Found` }

            const files = req.files as { [fieldname: string]: Express.Multer.File[] }
            
            const requiredFields = ["profileImage", "idCard", "educationCertificate"]
            for (const field of requiredFields) {
                if (!files?.[field] || files[field].length === 0) {
                    throw { status : 400, message : `${field} is required` }
                }
            }

            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
            const maxSizeMB = 5 

            for (const field in files) {
                for (const file of files[field]) {
                    const validationError = validateFile(file, allowedTypes, maxSizeMB);
                    if (validationError) {
                        throw { status : 400, message : "validationError" }
                    }
                }
            }

            const profileImageUrl = await this.imageUploaderService.uploadImage(files.profileImage[0].buffer);
            const idCardUrl =  await this.imageUploaderService.uploadImage(files.idCard[0].buffer);
            const educationCertificateUrl = await this.imageUploaderService.uploadImage(files.educationCertificate[0].buffer);

            const experienceCertificateUrl = files?.experienceCertificate?.[0] ?
                await this.imageUploaderService.uploadImage(files.experienceCertificate[0].buffer) : undefined;

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

            res.status(200).json({
                success: true,
                message: `KYC request ${result} successfully. You’ll be notified after verification.`
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
                throw { status: 401, message: "Not authenticated" };
            }

            const userId = req.user.userId
            const result = await this.updateProfileUseCase.execute(profileData,userId)

            res.status(200).json({
                success: true,
                message:  "Profile updated successfully",
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
                throw { status: 401, message: "Not authenticated" };
            }
            const userId = req.user.userId
            await this.verifyPasswordUseCase.execute(password,userId)  

            res.status(200).json({
                success: true,
                message: "Verification mail sent to your mail",
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
            
            res.status(200).json({
                success: true,
                message: "Verification mail sent to your mail"
            });

        } catch (error) {
            console.error("changePassword error:", error);
            next(error);
        }
     }

}