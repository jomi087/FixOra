import express from "express";
import { AuthMiddleware, userController, chatController, geocodeController } from "../../main/dependencyInjector";
import { validateRequest } from "../middleware/validateRequest";
import { bookingIdSchema, bookingRequestSchema, rescheduleBookingSchema } from "../validations/bookingSchema";
import { otpSchema, resetPasswordSchema, verifyPasswordSchema } from "../validations/authSchema";
import { validateKYCRequest } from "../validations/kycSchema";
import { editProfileSchema, emailSchema } from "../validations/profileSchema";

import upload from "../middleware/upload";
import { RoleEnum } from "../../shared/enumss/Roles";
import { addFundsSchema } from "../validations/walletSchema";
import { addReviewSchema, reportReviewSchema, updateReviewSchema } from "../validations/reviewSchema";
import { callLogSchema, startChatSchema } from "../validations/chatSchema";

const router = express.Router();

//Services Section
router.get("/services", AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.activeServices(req, res, next));

//Providers  Section
router.get("/providers", AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.activeProviders(req, res, next));

router.get("/geocode/reverse", AuthMiddleware([RoleEnum.Customer]), (req, res, next) => geocodeController.reverse(req, res, next));
router.get("/geocode/forward", AuthMiddleware([RoleEnum.Customer]), (req, res, next) => geocodeController.forward(req, res, next));
router.get("/geocode/search", AuthMiddleware([RoleEnum.Customer]), (req, res, next) => geocodeController.autocomplete(req, res, next));

router.post("/save-location", AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.saveLocation(req, res, next));

router.post("/provider-kyc",
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
router.post("/booking/review", validateRequest(addReviewSchema), AuthMiddleware([RoleEnum.Customer]), userController.addReview.bind(userController));
router.patch("/booking/review", validateRequest(updateReviewSchema), AuthMiddleware([RoleEnum.Customer]), userController.updatedReview.bind(userController));
router.post("/review/dispute", validateRequest(reportReviewSchema), AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.createReviewDispute(req, res, next));
router.get("/booking/review-status/:bookingId", AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.reviewStatus(req, res, next));

router.post("/provider/booking", validateRequest(bookingRequestSchema), AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.createBooking(req, res, next));
router.post("/reschedule/booking/:bookingId", validateRequest(rescheduleBookingSchema), AuthMiddleware([RoleEnum.Customer]), userController.rescheduleBooking.bind(userController));
router.post("/create-checkout-session", validateRequest(bookingIdSchema), AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.initiateOnlinePayment(req, res, next));
router.post("/wallet-payment", validateRequest(bookingIdSchema), AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.initiateWalletPayment(req, res, next));

//Profile Section
router.post("/email/update/request", validateRequest(emailSchema), AuthMiddleware([RoleEnum.Customer, RoleEnum.Admin]), (req, res, next) => userController.requestEmailUpdate(req, res, next));
router.post("/email/update/confirm", validateRequest(otpSchema), AuthMiddleware([RoleEnum.Customer, RoleEnum.Admin]), (req, res, next) => userController.confirmEmailUpdate(req, res, next));


router.patch("/editProfile", validateRequest(editProfileSchema), AuthMiddleware([RoleEnum.Customer, RoleEnum.Admin]), (req, res, next) => userController.editProfile(req, res, next));
router.post("/verifyPassword", validateRequest(verifyPasswordSchema), AuthMiddleware(), (req, res, next) => userController.verifyPassword(req, res, next));
router.patch("/change-password", validateRequest(resetPasswordSchema), AuthMiddleware(), (req, res, next) => userController.changePassword(req, res, next));

router.get("/booking-history", AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.getBookingHistory(req, res, next));
router.get("/bookingDetails/:bookingId", AuthMiddleware([RoleEnum.Customer]), userController.bookingDetails.bind(userController));
router.patch("/booking/retry-availability/:bookingId", AuthMiddleware([RoleEnum.Customer]), userController.retryAvailability.bind(userController));
router.patch("/booking/cancel-booking/:bookingId", AuthMiddleware([RoleEnum.Customer]), userController.cancelBooking.bind(userController));

router.post("/chats", validateRequest(startChatSchema), AuthMiddleware([RoleEnum.Customer]), chatController.startChat.bind(chatController));
router.get("/chats", AuthMiddleware([RoleEnum.Customer]), chatController.getChatList.bind(chatController));
router.get("/chats/:chatId/messages", AuthMiddleware([RoleEnum.Customer]), chatController.getChatMessages.bind(chatController));
router.post("/chats/:chatId/messages", upload.single("file"), AuthMiddleware([RoleEnum.Customer]), chatController.sendChatMessage.bind(chatController));
router.post("/chats/:chatId/call-log", validateRequest(callLogSchema), AuthMiddleware([RoleEnum.Customer]), chatController.logCall.bind(chatController));

router.get("/wallet", AuthMiddleware([RoleEnum.Customer, RoleEnum.Provider]), userController.walletInfo.bind(userController));
router.post("/wallet/add-fund", validateRequest(addFundsSchema), AuthMiddleware([RoleEnum.Customer, RoleEnum.Provider]), (req, res, next) => userController.addFund(req, res, next));

export default router;
