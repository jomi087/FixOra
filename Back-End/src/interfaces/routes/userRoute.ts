import express from "express";
import { AuthMiddleware, userController } from "../../main/dependencyInjector";
import { validateRequest } from "../middleware/validateRequest";
import { bookingIdSchema, bookingRequestSchema } from "../validations/bookingSchema";
import { resetPasswordSchema, verifyPasswordSchema } from "../validations/authSchema";
import { validateKYCRequest } from "../validations/kycSchema";
import { editProfileSchema } from "../validations/profileSchema";

import upload from "../middleware/upload";
import { RoleEnum } from "../../shared/Enums/Roles";
import { addFundsSchema } from "../validations/walletSchema";
import { FeedbackSchema } from "../validations/feedbackSchema";

const router = express.Router();

//Services Section
router.get("/services", AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.activeServices(req, res, next));

//Providers  Section
router.get("/providers", AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.activeProviders(req, res, next));
router.post(
    "/provider-kyc",
    AuthMiddleware([RoleEnum.Customer]),
    upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "idCard", maxCount: 1 },
        { name: "educationCertificate", maxCount: 1 },
        { name: "experienceCertificate", maxCount: 1 }
    ]),
    validateKYCRequest,
    (req, res, next) => userController.kycApplication(req, res, next)
);
router.get("/provider/bookings/:id", AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.providerInfo(req, res, next));
router.get("/provider/:id/reviews", AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.providerReview(req, res, next));

router.post("/provider/booking", validateRequest(bookingRequestSchema), AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.createBooking(req, res, next));
router.post("/create-checkout-session", validateRequest(bookingIdSchema), AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.initiateOnlinePayment(req, res, next));
router.post("/wallet-payment", validateRequest(bookingIdSchema), AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.initiateWalletPayment(req, res, next));

//Profile Section
router.patch("/editProfile", validateRequest(editProfileSchema), AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.editProfile(req, res, next));
router.post("/verifyPassword", validateRequest(verifyPasswordSchema), AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.verifyPassword(req, res, next));
router.patch("/change-password", validateRequest(resetPasswordSchema), AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.changePassword(req, res, next));

router.get("/booking-history", AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.getBookingHistory(req, res, next));
router.get("/bookingDetails/:bookingId", AuthMiddleware([RoleEnum.Customer]), userController.bookingDetails.bind(userController));
router.patch("/booking/retry-availability/:bookingId",AuthMiddleware([RoleEnum.Customer]), userController.retryAvailability.bind(userController));
router.patch("/booking/cancel-booking/:bookingId", AuthMiddleware([RoleEnum.Customer]), userController.cancelBooking.bind(userController));

router.get("/booking/review-status/:bookingId", AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.reviewStatus(req, res, next));
router.post("/booking/feedback", validateRequest(FeedbackSchema), AuthMiddleware([RoleEnum.Customer]), userController.addFeedback.bind(userController));

router.get("/wallet", AuthMiddleware([RoleEnum.Customer, RoleEnum.Provider]), userController.walletInfo.bind(userController));
router.post("/wallet/add-fund", validateRequest(addFundsSchema), AuthMiddleware([RoleEnum.Customer, RoleEnum.Provider]), (req, res, next) => userController.addFund(req, res, next));



export default router;