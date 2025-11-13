import express from "express";
import { AuthMiddleware, adminController } from "../../main/dependencyInjector";
import upload from "../middleware/upload";
import { validateCategory } from "../validations/categorySchema";
import { validateRequest } from "../middleware/validateRequest";
import { kycStatus } from "../validations/kycSchema";
import { RoleEnum } from "../../shared/enums/Roles";
import { disputeActionSchema } from "../validations/disputeSchema";

const router = express.Router();
router.get("/dashboard", AuthMiddleware([RoleEnum.Admin]), adminController.dashBoardReport.bind(adminController));

router.get("/customers", AuthMiddleware([RoleEnum.Admin]), adminController.getCustomers.bind(adminController));

router.get("/providers", AuthMiddleware([RoleEnum.Admin]), adminController.getProviders.bind(adminController));
router.get("/provider-applicationList", AuthMiddleware([RoleEnum.Admin]), adminController.getProviderApplications.bind(adminController));
router.patch("/provider-kyc/:id", validateRequest(kycStatus), AuthMiddleware([RoleEnum.Admin]), adminController.updateKYCStatus.bind(adminController));

router.patch("/users/:userId/status", AuthMiddleware([RoleEnum.Admin]), adminController.toggleUserStatus.bind(adminController));

router.get("/services", AuthMiddleware([RoleEnum.Admin]), adminController.getServices.bind(adminController));
router.post("/services", AuthMiddleware([RoleEnum.Admin]), upload.any(), validateCategory, adminController.addService.bind(adminController));
router.patch("/services/:categoryId/status", AuthMiddleware([RoleEnum.Admin]), adminController.toggleCategoryStatus.bind(adminController));

router.get("/disputes", AuthMiddleware([RoleEnum.Admin]), adminController.getDispute.bind(adminController));
router.get("/disputes/:disputeId/content", AuthMiddleware([RoleEnum.Admin]), adminController.disputeContentInfo.bind(adminController));
router.patch("/disputes/:disputeId/action", validateRequest(disputeActionSchema), AuthMiddleware([RoleEnum.Admin]), adminController.disputeAction.bind(adminController));

router.get("/commission-fee", AuthMiddleware([RoleEnum.Admin]), adminController.commissionFee.bind(adminController));
router.patch("/commission-fee", AuthMiddleware([RoleEnum.Admin]), adminController.updateCommissionFee.bind(adminController));
export default router;