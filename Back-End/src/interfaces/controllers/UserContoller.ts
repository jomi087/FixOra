import { NextFunction, Request, Response } from "express";
import { EditProfileDTO } from "../../application/dtos/EditProfileDTO.js";
import { UpdateProfileUseCase } from "../../application/useCases/client/UpdateProfileUseCase.js";
import { VerifyPasswordUseCase } from "../../application/useCases/client/VerifyPasswordUseCase.js";
import { ResetPasswordUseCase } from "../../application/useCases/ResetPasswordUseCase.js";

export class UserController {
    constructor(
        private updateProfileUseCase: UpdateProfileUseCase,
        private verifyPasswordUseCase: VerifyPasswordUseCase,
        private resetPasswordUseCase : ResetPasswordUseCase,
        
    ) { }
    
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
                message: result.message,
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
            const result = await this.verifyPasswordUseCase.execute(password,userId)  

            res.status(200).json({
                success: true,
                message: result.message,
            })
        } catch (error) {
            console.error("verifyPassword error:", error);
            next(error);
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { token, password } = req.body
        
            const result = await this.resetPasswordUseCase.execute(token, password)
            
            res.status(200).json({
                success: true,
                message: result.message,
            });

        } catch (error) {
            console.error("changePassword error:", error);
            next(error);
        }
     }

}