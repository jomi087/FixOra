import express from "express";
import { AuthMiddleware, adminController } from "../../main/dependencyInjector";
import upload from "../middleware/upload";
import { updateCategorySchema, validateCategory } from "../validations/categorySchema";
import { validateRequest } from "../middleware/validateRequest";
import { kycStatus } from "../validations/kycSchema";
import { RoleEnum } from "../../shared/enums/Roles";
import { disputeActionSchema } from "../validations/disputeSchema";
import { softRateLimit, strictRateLimit } from "../../infrastructure/security/rateLimiters";

const router = express.Router();
router.get("/dashboard", AuthMiddleware([RoleEnum.Admin]), softRateLimit, adminController.dashBoardReport.bind(adminController));

router.get("/customers", AuthMiddleware([RoleEnum.Admin]), softRateLimit, adminController.getCustomers.bind(adminController));

router.get("/providers", AuthMiddleware([RoleEnum.Admin]), softRateLimit, adminController.getProviders.bind(adminController));
router.get("/provider-applicationList", AuthMiddleware([RoleEnum.Admin]), softRateLimit, adminController.getProviderApplications.bind(adminController));
router.patch("/provider-kyc/:id", validateRequest(kycStatus), AuthMiddleware([RoleEnum.Admin]), strictRateLimit, adminController.updateKYCStatus.bind(adminController));

router.patch("/users/:userId/status", AuthMiddleware([RoleEnum.Admin]), strictRateLimit, adminController.toggleUserStatus.bind(adminController));

router.get("/services", AuthMiddleware([RoleEnum.Admin]), softRateLimit, adminController.getServices.bind(adminController));
router.post("/services",
    AuthMiddleware([RoleEnum.Admin]),
    strictRateLimit,
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "subcategoryImages", maxCount: 20 }
    ]),
    validateCategory,
    adminController.addService.bind(adminController)
);
router.patch("/services/:categoryId/status", AuthMiddleware([RoleEnum.Admin]), strictRateLimit, adminController.toggleCategoryStatus.bind(adminController));
router.patch("/services/:categoryId", AuthMiddleware([RoleEnum.Admin]), strictRateLimit, upload.single("image"), validateRequest(updateCategorySchema), adminController.updateCategory.bind(adminController));
router.patch("/subServices/:subCategoryId", AuthMiddleware([RoleEnum.Admin]), strictRateLimit, upload.single("image"), validateRequest(updateCategorySchema), adminController.updateSubCategory.bind(adminController));

router.get("/disputes", AuthMiddleware([RoleEnum.Admin]), softRateLimit, adminController.getDispute.bind(adminController));
router.get("/disputes/:disputeId/content", AuthMiddleware([RoleEnum.Admin]), softRateLimit, adminController.disputeContentInfo.bind(adminController));
router.patch("/disputes/:disputeId/action", validateRequest(disputeActionSchema), AuthMiddleware([RoleEnum.Admin]), strictRateLimit, adminController.disputeAction.bind(adminController));

router.get("/commission-fee", AuthMiddleware([RoleEnum.Admin]), softRateLimit, adminController.commissionFee.bind(adminController));
router.patch("/commission-fee", AuthMiddleware([RoleEnum.Admin]), strictRateLimit, adminController.updateCommissionFee.bind(adminController));
export default router;