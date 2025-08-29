import express from "express";
import { userController } from "../../main/dependencyInjector";
const router = express.Router();

router.post("/payment/stripe/webhook", express.raw({ type: "application/json" }), (req, res, next) => userController.verifyPaymentViaWebHook(req, res, next)); 

export default router;

