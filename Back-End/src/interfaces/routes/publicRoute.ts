import express from "express";
import { AuthMiddleware, publicController } from "../../main/dependencyInjector";
import { RoleEnum } from "../../shared/enums/Roles";
import { mediumRateLimit, softRateLimit } from "../../infrastructure/security/rateLimiters";

const router = express.Router();
router.get("/landing-data", softRateLimit, publicController.getLandingData.bind(publicController));
router.get("/notifications", AuthMiddleware([RoleEnum.Customer,RoleEnum.Provider,RoleEnum.Admin]), mediumRateLimit, publicController.getNotifications.bind(publicController));
router.patch("/notification/acknowledge/:notificationId", AuthMiddleware([RoleEnum.Customer,RoleEnum.Provider,RoleEnum.Admin]), mediumRateLimit, publicController.acknowledgeNotification.bind(publicController));

export default router;