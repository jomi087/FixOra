import { NextFunction, Request, Response } from "express";
import { GetCustomersUseCase } from "../../application/useCases/admin/GetCustomersUseCase.js";
import { KYCStatus } from "../../shared/constant/KYCstatus.js";
import { GetProvidersUseCase } from "../../application/useCases/admin/GetProvidersUseCase.js";
import { GetServiceUseCase } from "../../application/useCases/admin/GetServiceUseCase.js";
import { CreateServiceCategoryUseCase } from "../../application/useCases/admin/CreateServiceCategoryUseCase.js";
import { ToggleCategoryStatusUseCase } from "../../application/useCases/admin/ToggleCategoryStatusUseCase.js";
import { ToggleUserStatusUseCase } from "../../application/useCases/admin/ToggleUserStatusUseCase.js";
import { IImageUploaderService } from "../../domain/interface/ServiceInterface/IImageUploaderService.js";
import { CategoryInputDTO, SubcategoryInputDTO } from "../../application/InputDTO's/CategoryInputDTO.js";


export class AdminController {
    constructor(
        private getCustomersUseCase: GetCustomersUseCase,
        private toggleUserStatusUseCase : ToggleUserStatusUseCase,
        private getProvidersUseCase: GetProvidersUseCase,
        private getServiceUseCase: GetServiceUseCase,
        private createServiceCategoryUseCase: CreateServiceCategoryUseCase,
        private imageUploaderService: IImageUploaderService, 
        private toggleCategoryStatusUseCase: ToggleCategoryStatusUseCase,

    ) { }

    async getCustomers(req: Request, res: Response, next: NextFunction) :Promise<void>{
        try {

            const searchQuery = req.query.searchQuery as string || "";
            const filter = req.query.filter as string || "all";
            const currentPage = parseInt(req.query.currentPage as string) || 1;
            const limit = parseInt(req.query.itemsPerPage as string) || 8;

            const result = await this.getCustomersUseCase.execute({searchQuery,filter,currentPage,limit});

            res.status(200).json({
                success: true,
                customersData: result.customersData,
                total : result.total
            });
            
        } catch (error) {
            console.error("getCustomers error:", error);
            next(error);
        }
    }

    async toggleUserStatus(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const { userId } = req.params
            await this.toggleUserStatusUseCase.execute(userId);

            res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error toggling status:", error)
            next(error)
        }
    }
    
    async getProviders(req: Request, res: Response, next: NextFunction) :Promise<void>{
        try {

            const searchQuery = req.query.searchQuery as string || "";
            const filter = req.query.filter as string || "all";
            const currentPage = parseInt(req.query.currentPage as string) || 1
            const limit = parseInt(req.query.itemsPerPage as string) || 8; 

            const result = await this.getProvidersUseCase.execute({ searchQuery, filter, currentPage, limit });

            res.status(200).json({
                success: true,
                providerData: result.providerData,
                total: result.total
            });
            
        } catch (error) {
            console.error("getProviders error:", error);
            next(error);
        }
    }

    

    async getServices(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const searchQuery = req.query.searchQuery as string || "";
            const filter = req.query.filter as string || "all";
            const currentPage = parseInt(req.query.currentPage as string) || 1;
            const limit = parseInt(req.query.itemsPerPage as string) || 8; 

            const result = await this.getServiceUseCase.execute({ searchQuery, filter, currentPage, limit });

            res.status(200).json({
                success: true,               
                catogoriesData: result.catogoriesData,
                total : result.total
            });

        } catch (error) {
            console.error("getService error:", error);
            next(error);
        }
    }

    async addService(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let { name, description, subcategories } = req.body;

            const files = req.files as Express.Multer.File[];

            const mainImageFile = files.find(file => file.fieldname === "image");

            if (!mainImageFile) throw { status: 400, message: "Main category image missing" };
            
            const mainImageUrl = await this.imageUploaderService.uploadImage(mainImageFile.buffer);

            const subcategoriesWithUrls = await Promise.all(
                subcategories.map(async (sub: any, index: number) => {
                    const subImageFile = files.find(file => file.fieldname === `subcategoryImages[${index}]`);
                    if (!subImageFile) throw { status: 400, message: `Subcategory image missing at index ${index}` };
                    const imageUrl = await this.imageUploaderService.uploadImage(subImageFile.buffer);

                    return {
                    name: sub.name,
                    description: sub.description,
                    image: imageUrl,
                    };
                })
            );

            const categoryInputDTO = {
            name,
            description,
            subcategories: subcategoriesWithUrls ,
            image: mainImageUrl,
            } as CategoryInputDTO

            await this.createServiceCategoryUseCase.execute(categoryInputDTO);

            res.status(200).json({
                success: true,
                message: "Category created successfully",
            });

        } catch (error) {
            next(error);
        }
    }


    async toggleCategoryStatus(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const { categoryId } = req.params
            await this.toggleCategoryStatusUseCase.execute(categoryId);

            res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error toggling status:", error)
            next(error)
        }
    }

}