import { NextFunction, Request, Response } from "express";
import { RoleEnum } from "../../shared/Enums/Roles.js";
import { HttpStatusCode } from "../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../shared/Messages.js";


import { IGetCustomersUseCase } from "../../application/Interface/useCases/Admin/IGetCustomersUseCase.js";
import { IGetProvidersUseCase } from "../../application/Interface/useCases/Admin/IGetProvidersUseCase.js";
import { IGetServiceUseCase } from "../../application/Interface/useCases/Admin/IGetServiceUseCase.js";
import { ICreateServiceCategoryUseCase } from "../../application/Interface/useCases/Admin/ICreateServiceCategoryUseCase.js";
import { IToggleCategoryStatusUseCase } from "../../application/Interface/useCases/Admin/IToggleCategoryStatusUseCase.js";
import { IToggleUserStatusUseCase } from "../../application/Interface/useCases/Admin/IToggleUserStatusUseCase.js";
import { IImageUploaderService } from "../../domain/interface/ServiceInterface/IImageUploaderService.js";
import { IProviderApplicationUseCase } from "../../application/Interface/useCases/Admin/IProviderApplicationUseCase.js";
import { IUpdateKYCStatusUseCase } from "../../application/Interface/useCases/Admin/IUpdateKYCStatusUseCase.js";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService.js";

const { OK, BAD_REQUEST, FORBIDDEN } = HttpStatusCode;
const {  UNAUTHORIZED_MSG, MAIN_CATEGORY_IMAGE_MISSING, SUBCATEGORY_IMAGE_MISSING, CATEGORY_CREATED_SUCCESS } = Messages;

export class AdminController {
    constructor(
        private _loggerService: ILoggerService,
        private _getCustomersUseCase: IGetCustomersUseCase,
        private _toggleUserStatusUseCase: IToggleUserStatusUseCase,
        private _getProvidersUseCase: IGetProvidersUseCase,
        private _providerApplicationUseCase: IProviderApplicationUseCase,
        private _updateKYCStatusUseCase : IUpdateKYCStatusUseCase,
        private _getServiceUseCase: IGetServiceUseCase,
        private _createServiceCategoryUseCase: ICreateServiceCategoryUseCase,
        private _imageUploaderService: IImageUploaderService,
        private _toggleCategoryStatusUseCase: IToggleCategoryStatusUseCase,
    ) { }

    async getCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const searchQuery = req.query.searchQuery as string || "";
            const filter = req.query.filter as string || "all";
            const currentPage = parseInt(req.query.currentPage as string) || 1;
            const limit = parseInt(req.query.itemsPerPage as string) || 8;

            const result = await this._getCustomersUseCase.execute({ searchQuery, filter, currentPage, limit });

            res.status(OK).json({
                success: true,
                customersData: result.data,
                total: result.total
            });
            
        } catch (error:any) {
            this._loggerService.error(`getCustomers error:, ${error.message}`,{stack : error.stack});
            next(error);
        }
    }

    async toggleUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.params
            await this._toggleUserStatusUseCase.execute(userId);

            res.status(OK).json({ success: true });
        } catch (error:any) {
            this._loggerService.error(`toggleUserStatus error:, ${error.message}`,{stack : error.stack});
            next(error)
        }
    }
    
    async getProviders(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const searchQuery = req.query.searchQuery as string || "";
            const filter = req.query.filter as string || "all";
            const currentPage = parseInt(req.query.currentPage as string) || 1
            const limit = parseInt(req.query.itemsPerPage as string) || 8;

            const result = await this._getProvidersUseCase.execute({ searchQuery, filter, currentPage, limit });

            res.status(OK).json({
                success: true,
                providerData: result.data,
                total: result.total
            });
            
        } catch (error:any) {
            this._loggerService.error(`getProviders error:, ${error.message}`,{stack : error.stack});
            next(error);
        }
    }

    async getProviderApplications(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const searchQuery = req.query.searchQuery as string || ""
            const filter = req.query.filter as string|| "Pending"
            const currentPage = parseInt(req.query.currentPage as string) || 1
            const limit = parseInt(req.query.itemsPerPage as string) || 8
            
            const result = await this._providerApplicationUseCase.execute({ searchQuery, filter, currentPage, limit });

            res.status(OK).json({
                success: true,
                ApplicationData : result.data,
                total: result.total
            });

        } catch (error:any) {
            this._loggerService.error(`getProviderApplications error:, ${error.message}`,{stack : error.stack});
            next(error);
        }
    }

    async updateKYCStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const { action, reason } = req.body;

            if (!req.user || req.user.role !== RoleEnum.Admin || !req.user.userId) {
                throw { status: FORBIDDEN , message: UNAUTHORIZED_MSG };
            }

            const adminId = req.user.userId
            const result = await this._updateKYCStatusUseCase.execute({ id,action,reason,adminId});

            res.status(OK).json({
                success: true,
                message: result.message,
                id : result.id
            });

        } catch (error:any) {
            this._loggerService.error(`updateKYCStatus error:, ${error.message}`,{stack : error.stack});
            next(error);
        }
    }

    async getServices(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const searchQuery = req.query.searchQuery as string || "";
            const filter = req.query.filter as string || "all";
            const currentPage = parseInt(req.query.currentPage as string) || 1;
            const limit = parseInt(req.query.itemsPerPage as string) || 8; 

            const result = await this._getServiceUseCase.execute({ searchQuery, filter, currentPage, limit });

            res.status(OK).json({
                success: true,               
                catogoriesData: result.data,
                total : result.total
            });

        } catch (error:any) {
            this._loggerService.error(`getService error:, ${error.message}`,{stack : error.stack});
            next(error);
        }
    }

    async addService(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let { name, description, subcategories } = req.body;

            const files = req.files as Express.Multer.File[];

            const mainImageFile = files.find(file => file.fieldname === "image");

            if (!mainImageFile) throw { status: BAD_REQUEST, message: MAIN_CATEGORY_IMAGE_MISSING  };
            
            const mainImageUrl = await this._imageUploaderService.uploadImage(mainImageFile.buffer, "FixOra/Services");

            const subcategoriesWithUrls = await Promise.all(
                subcategories.map(async (sub: any, index: number) => {
                    const subImageFile = files.find(file => file.fieldname === `subcategoryImages[${index}]`);
                    if (!subImageFile) throw { status: BAD_REQUEST, message: SUBCATEGORY_IMAGE_MISSING };
                    const imageUrl = await this._imageUploaderService.uploadImage(subImageFile.buffer, "FixOra/Services");

                    return {
                    name: sub.name,
                    description: sub.description,
                    image: imageUrl,
                    };
                })
            );

            const input = {
                name,
                description,
                subcategories: subcategoriesWithUrls ,
                image: mainImageUrl,
            }

            await this._createServiceCategoryUseCase.execute(input);

            res.status(OK).json({
                success: true,
                message: CATEGORY_CREATED_SUCCESS,
            });

        } catch (error: any) {
            this._loggerService.error(`activeServices error:, ${error.message}`,{stack : error.stack});
            next(error);
        }
    }

    async toggleCategoryStatus(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const { categoryId } = req.params
            await this._toggleCategoryStatusUseCase.execute(categoryId);

            res.status(OK).json({ success: true });
        } catch (error:any) {
            this._loggerService.error(`toggleCategoryStatus Error:, ${error.message}`,{stack : error.stack});
            next(error)
        }
    }

}