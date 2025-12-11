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
import { callLogSchema, chatMessageSchema, startChatSchema } from "../validations/chatSchema";

const router = express.Router();

router.get("/booking-request", AuthMiddleware([RoleEnum.Provider]), providerController.pendingBookingRequest.bind(providerController));
router.patch("/booking/:bookingId/status", validateRequest(bookingStatusSchema), AuthMiddleware([RoleEnum.Provider]), providerController.respondToBookingRequest.bind(providerController));
router.get("/confirm-bookings", AuthMiddleware([RoleEnum.Provider]), providerController.confirmBookings.bind(providerController));
router.get("/jobDetails/:bookingId", AuthMiddleware([RoleEnum.Provider]), providerController.jobDetails.bind(providerController));


router.post("/chats",validateRequest(startChatSchema), AuthMiddleware([RoleEnum.Provider]), chatController.startChat.bind(chatController));
router.get("/chats", AuthMiddleware([RoleEnum.Provider]), chatController.getChatList.bind(chatController));
router.get("/chats/:chatId/messages", AuthMiddleware([RoleEnum.Provider]),  chatController.getChatMessages.bind(chatController));;
router.post("/chats/:chatId/messages", validateRequest(chatMessageSchema), AuthMiddleware([RoleEnum.Provider]), chatController.sendChatMessage.bind(chatController));
router.post("/chats/:chatId/call-log", validateRequest(callLogSchema), AuthMiddleware([RoleEnum.Provider]), chatController.logCall.bind(chatController));

router.get("/job-history", AuthMiddleware([RoleEnum.Provider]), providerController.getJobHistory.bind(providerController));
router.post("/arrival-otp/:bookingId", AuthMiddleware([RoleEnum.Provider]), providerController.arrivalOtp.bind(providerController));
router.post("/verify-arrivalOtp", validateRequest(otpSchema), AuthMiddleware([RoleEnum.Provider]), providerController.verifyArrivalOtp.bind(providerController));
router.post(
    "/acknowledge-completion",
    AuthMiddleware([RoleEnum.Provider]),
    upload.array("workProofImages", 3),
    validateRequest(diagnoseSchema),
    providerController.acknowledgeCompletionWithProof.bind(providerController)
);
router.get("/provider-services", AuthMiddleware([RoleEnum.Provider]), providerController.providerServices.bind(providerController));
router.get("/provider-data", AuthMiddleware([RoleEnum.Provider]), providerController.providerInfo.bind(providerController));
router.patch("/provider-data", validateRequest(UpdateProviderDataSchema), AuthMiddleware([RoleEnum.Provider]), providerController.updateProviderData.bind(providerController));
router.get("/availability-time", AuthMiddleware([RoleEnum.Provider]), providerController.getAvailabilityTime.bind(providerController));
router.post("/schedule-availability-time", validateRequest(workTimeSchema), AuthMiddleware([RoleEnum.Provider]), providerController.scheduleAvailabilityTime.bind(providerController));
router.patch("/toggle-availability", validateRequest(daySchema), AuthMiddleware([RoleEnum.Provider]), providerController.toggleAvailability.bind(providerController));
router.get("/generate-salesReport", AuthMiddleware([RoleEnum.Provider]), providerController.generateSalesReport.bind(providerController));

export default router;


