import express from "express";
import { AuthMiddleware, adminController } from "../../main/dependencyInjector";
import upload from "../middleware/upload";
import { validateCategory } from "../validations/categorySchema";
import { validateRequest } from "../middleware/validateRequest";
import { kycStatus } from "../validations/kycSchema";
import { RoleEnum } from "../../shared/enums/Roles";

const router = express.Router();
router.get("/customer-management", AuthMiddleware([RoleEnum.Admin]), adminController.getCustomers.bind(adminController));
router.patch("/customer-management/:userId",AuthMiddleware([RoleEnum.Admin]),adminController.toggleUserStatus.bind(adminController));
router.get("/provider-management", AuthMiddleware([RoleEnum.Admin]), adminController.getProviders.bind(adminController));
router.get("/provider-applicationList", AuthMiddleware([RoleEnum.Admin]), adminController.getProviderApplications.bind(adminController));
router.patch("/provider-kyc/:id",validateRequest(kycStatus), AuthMiddleware([RoleEnum.Admin]), adminController.updateKYCStatus.bind(adminController));
router.get("/service-management",  AuthMiddleware([RoleEnum.Admin]), adminController.getServices.bind(adminController));
router.post("/service-management", AuthMiddleware([RoleEnum.Admin]), upload.any(), validateCategory, adminController.addService.bind(adminController));
router.patch("/service-management/:categoryId", AuthMiddleware([RoleEnum.Admin]), adminController.toggleCategoryStatus.bind(adminController));

export default router;