import express from "express";
import { validateRequest } from "../middleware/validateRequest";
import { bookingStatusSchema } from "../validations/bookingSchema";
import { providerController, AuthMiddleware, chatController } from "../../main/dependencyInjector";
import { RoleEnum } from "../../shared/enums/Roles";
import { otpSchema } from "../validations/authSchema";
import { daySchema, workTimeSchema } from "../validations/availabilitySchema";
import upload from "../middleware/upload";
import { diagnoseSchema } from "../validations/diagnoseSchema";
import { UpdateProviderDataSchema } from "../validations/providerDataSchema";
import { callLogSchema, startChatSchema } from "../validations/chatSchema";
import { chatSendRateLimit, mediumRateLimit, softRateLimit, strictRateLimit } from "../../infrastructure/security/rateLimiters";

const router = express.Router();

router.get("/booking-request", AuthMiddleware([RoleEnum.Provider]), softRateLimit, providerController.pendingBookingRequest.bind(providerController));
router.patch("/booking/:bookingId/status", validateRequest(bookingStatusSchema), AuthMiddleware([RoleEnum.Provider]), mediumRateLimit, providerController.respondToBookingRequest.bind(providerController));
router.get("/confirm-bookings", AuthMiddleware([RoleEnum.Provider]), softRateLimit, providerController.confirmBookings.bind(providerController));
router.get("/jobDetails/:bookingId", AuthMiddleware([RoleEnum.Provider]), softRateLimit, providerController.jobDetails.bind(providerController));


router.post("/chats", validateRequest(startChatSchema), AuthMiddleware([RoleEnum.Provider]), mediumRateLimit, chatController.startChat.bind(chatController));
router.get("/chats", AuthMiddleware([RoleEnum.Provider]), softRateLimit, chatController.getChatList.bind(chatController));
router.get("/chats/:chatId/messages", AuthMiddleware([RoleEnum.Provider]),  softRateLimit, chatController.getChatMessages.bind(chatController));;
router.post("/chats/:chatId/messages", upload.single("file"), AuthMiddleware([RoleEnum.Provider]), chatSendRateLimit, chatController.sendChatMessage.bind(chatController));
router.post("/chats/:chatId/call-log", validateRequest(callLogSchema), AuthMiddleware([RoleEnum.Provider]), mediumRateLimit, chatController.logCall.bind(chatController));

router.get("/job-history", AuthMiddleware([RoleEnum.Provider]), softRateLimit, providerController.getJobHistory.bind(providerController));
router.post("/arrival-otp/:bookingId", AuthMiddleware([RoleEnum.Provider]), mediumRateLimit, providerController.arrivalOtp.bind(providerController));
router.post("/verify-arrivalOtp", validateRequest(otpSchema), AuthMiddleware([RoleEnum.Provider]), mediumRateLimit, providerController.verifyArrivalOtp.bind(providerController));
router.post(
    "/acknowledge-completion",
    AuthMiddleware([RoleEnum.Provider]),
    strictRateLimit,
    upload.array("workProofImages", 3),
    validateRequest(diagnoseSchema),
    providerController.acknowledgeCompletionWithProof.bind(providerController)
);
router.get("/provider-services", AuthMiddleware([RoleEnum.Provider]), softRateLimit, providerController.providerServices.bind(providerController));
router.get("/provider-data", AuthMiddleware([RoleEnum.Provider]), softRateLimit, providerController.providerInfo.bind(providerController));
router.patch("/provider-data", validateRequest(UpdateProviderDataSchema), AuthMiddleware([RoleEnum.Provider]), mediumRateLimit, providerController.updateProviderData.bind(providerController));
router.get("/availability-time", AuthMiddleware([RoleEnum.Provider]), softRateLimit, providerController.getAvailabilityTime.bind(providerController));
router.post("/schedule-availability-time", validateRequest(workTimeSchema), AuthMiddleware([RoleEnum.Provider]), mediumRateLimit, providerController.scheduleAvailabilityTime.bind(providerController));
router.patch("/toggle-availability", validateRequest(daySchema), AuthMiddleware([RoleEnum.Provider]), mediumRateLimit, providerController.toggleAvailability.bind(providerController));
router.get("/generate-salesReport", AuthMiddleware([RoleEnum.Provider]), mediumRateLimit, providerController.generateSalesReport.bind(providerController));

export default router;


