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
import { ICommissionFeeUseCase } from "../../application/Interface/useCases/Admin/ICommissionFeeUseCase";
import { IUpdateCommissionFeeUseCase } from "../../application/Interface/useCases/Admin/IUpdateCommissionFeeUseCase";
import { IDashboardReportUseCase } from "../../application/Interface/useCases/Admin/IDashboardReportUseCase";
import { IGetDisputesUseCase } from "../../application/Interface/useCases/Admin/IGetDisputesUseCase";
import { DisputeStatus, DisputeType } from "../../shared/enums/Dispute";
import { IDisputeContentInfoUseCase } from "../../application/Interface/useCases/Admin/IDisputeContentInfoUseCase";

const { OK, BAD_REQUEST, FORBIDDEN } = HttpStatusCode;
const { UNAUTHORIZED_MSG, MAIN_CATEGORY_IMAGE_MISSING, SUBCATEGORY_IMAGE_MISSING, CATEGORY_CREATED_SUCCESS } = Messages;

export class AdminController {
    constructor(
        private _dashboardReportUseCase: IDashboardReportUseCase,
        private _getCustomersUseCase: IGetCustomersUseCase,
        private _toggleUserStatusUseCase: IToggleUserStatusUseCase,
        private _getProvidersUseCase: IGetProvidersUseCase,
        private _providerApplicationUseCase: IProviderApplicationUseCase,
        private _updateKYCStatusUseCase: IUpdateKYCStatusUseCase,
        private _getServiceUseCase: IGetServiceUseCase,
        private _createServiceCategoryUseCase: ICreateServiceCategoryUseCase,
        private _imageUploaderService: IImageUploaderService,
        private _toggleCategoryStatusUseCase: IToggleCategoryStatusUseCase,
        private _getDisputesUseCase: IGetDisputesUseCase,
        private _disputeContentInfoUseCase: IDisputeContentInfoUseCase,
        private _commissionFeeUseCase: ICommissionFeeUseCase,
        private _updateCommissionFeeUseCase: IUpdateCommissionFeeUseCase,
    ) { }

    async dashBoardReport(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const range = req.query.range as "yearly" | "monthly" | "weekly" | "daily";
            const { overview, growth, bookingsOverTime, bookingsByService, topProviders } = await this._dashboardReportUseCase.execute(range);

            res.status(OK).json({
                success: true,
                overview,
                growth,
                bookingsOverTime,
                bookingsByService,
                topProviders
            });

        } catch (error) {
            next(error);
        }
    }

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

    async getDispute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { searchQuery = "", filterType = "", filterStatus = "", page = 1, limit = 10 } = req.query;

            const result = await this._getDisputesUseCase.execute({
                searchQuery: String(searchQuery),
                filterType: String(filterType) as "" | DisputeType,
                filterStatus: String(filterStatus) as "" | DisputeStatus,
                page: Number(page),
                limit: Number(limit),
            });

            res.status(OK).json({
                success: true,
                disputeData: result.data,
                total: result.total
            });

        } catch (error) {
            next(error);
        }
    }

    async disputeContentInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { disputeId } = req.params;
            const result = await this._disputeContentInfoUseCase.execute(disputeId);

            res.status(OK).json({
                success: true,
                contentData: result,
            });

        } catch (error) {
            next(error);
        }
    }

    async commissionFee(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw { status: FORBIDDEN, message: UNAUTHORIZED_MSG };
            }

            const data = await this._commissionFeeUseCase.execute();

            res.status(OK).json({
                success: true,
                commissionFeeData: data
            });
        } catch (error) {
            next(error);
        }
    }

    async updateCommissionFee(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw { status: FORBIDDEN, message: UNAUTHORIZED_MSG };
            }
            const { commissionFee } = req.body;

            const data = await this._updateCommissionFeeUseCase.execute(commissionFee);

            res.status(OK).json({
                success: true,
                updatedCommissionFeeData: data
            });
        } catch (error) {
            next(error);
        }
    }


}
