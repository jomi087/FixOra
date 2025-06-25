import { NextFunction, Request, Response } from "express";
import { RoleEnum } from "../../domain/constant/Roles.js";
import { GetUsersByRoleUseCase } from "../../application/useCases/admin/GetUsersByRoleUseCase.js";


export class AdminController {
    constructor(
        private getUsersByRoleUseCase : GetUsersByRoleUseCase
    ) { }

    async getUsersByRole(req: Request, res: Response, next: NextFunction) :Promise<void>{
        try {
            const role = req.query.role as RoleEnum
            
            const result = await this.getUsersByRoleUseCase.execute(role)
            res.status(200).json(result);
            
        } catch (error) {
            console.error("getUsersByRole error:", error);
            next(error);
        }
    }
}