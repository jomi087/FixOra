import express from "express";
import { AuthMiddleware, publicController } from "../../main/dependencyInjector";
import { RoleEnum } from "../../shared/Enums/Roles";

const router = express.Router();
router.get("/landing-data", publicController.getLandingData.bind(publicController));
router.get("/notifications",  AuthMiddleware([RoleEnum.Customer,RoleEnum.Provider,RoleEnum.Admin]), publicController.getNotifications.bind(publicController));

export default router;