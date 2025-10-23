import { NextFunction, Request, Response } from "express";
import { RoleEnum } from "../../shared/enums/Roles";
import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";
import { Messages } from "../../shared/const/Messages";

import { IGetCustomersUseCase } from "../../application/Interface/useCases/Admin/IGetCustomersUseCase";
import { IGetProvidersUseCase } from "../../application/Interface/useCases/Admin/IGetProvidersUseCase";
import { IGetServiceUseCase } from "../../application/Interface/useCases/Admin/IGetServiceUseCase";
import { ICreateServiceCategoryUseCase } from "../../application/Interface/useCases/Admin/ICreateServiceCategoryUseCase";
import { IToggleCategoryStatusUseCase } from "../../application/Interface/useCases/Admin/IToggleCategoryStatusUseCase";
import { IToggleUserStatusUseCase } from "../../application/Interface/useCases/Admin/IToggleUserStatusUseCase";
import { IImageUploaderService } from "../../domain/interface/ServiceInterface/IImageUploaderService";
import { IProviderApplicationUseCase } from "../../application/Interface/useCases/Admin/IProviderApplicationUseCase";
import { IUpdateKYCStatusUseCase } from "../../application/Interface/useCases/Admin/IUpdateKYCStatusUseCase";
import { IPlatformFeeUseCase } from "../../application/Interface/useCases/Admin/IPlatformFeeUseCase";
import { IUpdatePlatformFeeUseCase } from "../../application/Interface/useCases/Admin/IUpdatePlatformFeeUseCase";

const { OK, BAD_REQUEST, FORBIDDEN } = HttpStatusCode;
const { UNAUTHORIZED_MSG, MAIN_CATEGORY_IMAGE_MISSING, SUBCATEGORY_IMAGE_MISSING, CATEGORY_CREATED_SUCCESS } = Messages;

export class AdminController {
    constructor(
        private _getCustomersUseCase: IGetCustomersUseCase,
        private _toggleUserStatusUseCase: IToggleUserStatusUseCase,
        private _getProvidersUseCase: IGetProvidersUseCase,
        private _providerApplicationUseCase: IProviderApplicationUseCase,
        private _updateKYCStatusUseCase: IUpdateKYCStatusUseCase,
        private _getServiceUseCase: IGetServiceUseCase,
        private _createServiceCategoryUseCase: ICreateServiceCategoryUseCase,
        private _imageUploaderService: IImageUploaderService,
        private _toggleCategoryStatusUseCase: IToggleCategoryStatusUseCase,
        private _platformFeeUseCase: IPlatformFeeUseCase,
        private _updatePlatformFeeUseCase: IUpdatePlatformFeeUseCase,
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

        } catch (error) {
            next(error);
        }
    }

    async toggleUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.params;
            await this._toggleUserStatusUseCase.execute(userId);

            res.status(OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    async getProviders(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const searchQuery = req.query.searchQuery as string || "";
            const filter = req.query.filter as string || "all";
            const currentPage = parseInt(req.query.currentPage as string) || 1;
            const limit = parseInt(req.query.itemsPerPage as string) || 8;

            const result = await this._getProvidersUseCase.execute({ searchQuery, filter, currentPage, limit });

            res.status(OK).json({
                success: true,
                providerData: result.data,
                total: result.total
            });

        } catch (error) {
            next(error);
        }
    }

    async getProviderApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const searchQuery = req.query.searchQuery as string || "";
            const filter = req.query.filter as string || "Pending";
            const currentPage = parseInt(req.query.currentPage as string) || 1;
            const limit = parseInt(req.query.itemsPerPage as string) || 8;

            const result = await this._providerApplicationUseCase.execute({ searchQuery, filter, currentPage, limit });

            res.status(OK).json({
                success: true,
                ApplicationData: result.data,
                total: result.total
            });

        } catch (error) {
            next(error);
        }
    }

    async updateKYCStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const { action, reason } = req.body;

            if (!req.user || req.user.role !== RoleEnum.Admin || !req.user.userId) {
                throw { status: FORBIDDEN, message: UNAUTHORIZED_MSG };
            }

            const adminId = req.user.userId;
            const result = await this._updateKYCStatusUseCase.execute({ id, action, reason, adminId });

            res.status(OK).json({
                success: true,
                message: result.message,
                id: result.id
            });

        } catch (error) {
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
                total: result.total
            });

        } catch (error) {
            next(error);
        }
    }

    async addService(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let { name, description, subcategories } = req.body;

            const files = req.files as Express.Multer.File[];

            const mainImageFile = files.find(file => file.fieldname === "image");

            if (!mainImageFile) throw { status: BAD_REQUEST, message: MAIN_CATEGORY_IMAGE_MISSING };

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
                subcategories: subcategoriesWithUrls,
                image: mainImageUrl,
            };

            await this._createServiceCategoryUseCase.execute(input);

            res.status(OK).json({
                success: true,
                message: CATEGORY_CREATED_SUCCESS,
            });

        } catch (error) {
            next(error);
        }
    }

    async toggleCategoryStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { categoryId } = req.params;
            await this._toggleCategoryStatusUseCase.execute(categoryId);

            res.status(OK).json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    async platformFee(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw { status: FORBIDDEN, message: UNAUTHORIZED_MSG };
            }

            const data = await this._platformFeeUseCase.execute();

            res.status(OK).json({
                success: true,
                platformFeeData: data
            });
        } catch (error) {
            next(error);
        }
    }

    async updatePlatformFee(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw { status: FORBIDDEN, message: UNAUTHORIZED_MSG };
            }
            const { platformFee } = req.body;

            const data = await this._updatePlatformFeeUseCase.execute(platformFee);

            res.status(OK).json({
                success: true,
                updatedPlatformFeeData: data
            });
        } catch (error) {
            next(error);
        }
    }


}
