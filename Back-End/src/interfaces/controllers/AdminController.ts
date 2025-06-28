import { NextFunction, Request, Response } from "express";
import { RoleEnum } from "../../shared/constant/Roles.js";
import { GetCustomersUseCase } from "../../application/useCases/admin/GetCustomersUseCase.js";
import { KYCStatus } from "../../shared/constant/KYCstatus.js";
import { GetProvidersUseCase } from "../../application/useCases/admin/GetProvidersUseCase.js";


export class AdminController {
    constructor(
        private getCustomersUseCase: GetCustomersUseCase,
        private getProvidersUseCase : GetProvidersUseCase 
    ) { }

    async getCustomers(req: Request, res: Response, next: NextFunction) :Promise<void>{
        try {

            const searchQuery = req.query.searchQuery as string || "";
            const filter = req.query.filter as string || "all";
            const currentPage = parseInt(req.query.currentPage as string) || 1;
            const limit = parseInt(req.query.pageSize as string) || 8;

            const result = await this.getCustomersUseCase.execute({searchQuery,filter,currentPage,limit});


            res.status(200).json(result);
            
        } catch (error) {
            console.error("getUsersByRole error:", error);
            next(error);
        }
    }

    
    async getProviders(req: Request, res: Response, next: NextFunction) :Promise<void>{
        try {

            const searchQuery = req.query.searchQuery as string || "";
            const filter = req.query.filter as string || "all";
            const currentPage = parseInt(req.query.currentPage as string) || 1
            const limit = parseInt(req.query.pageSize as string) || 8; 
            const ProviderStatus = KYCStatus.Approved

            const result = await this.getProvidersUseCase.execute({searchQuery,filter,currentPage,limit,ProviderStatus})

            res.status(200).json(result);
            
        } catch (error) {
            console.error("getUsersByRole error:", error);
            next(error);
        }
    }
}