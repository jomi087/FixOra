import express from "express";
import { validateRequest } from "../middleware/validateRequest";
import { bookingStatusSchema } from "../validations/bookingSchema";
import { providerController, AuthMiddleware } from "../../main/dependencyInjector";
import { RoleEnum } from "../../shared/Enums/Roles";
import { otpSchema } from "../validations/authSchema";
import { daySchema, workTimeSchema } from "../validations/availabilitySchema";

const router = express.Router();

router.patch("/booking/:bookingId/status", validateRequest(bookingStatusSchema), AuthMiddleware([RoleEnum.Provider]), providerController.respondToBookingRequest.bind(providerController));
router.get("/confirm-bookings", AuthMiddleware([RoleEnum.Provider]), providerController.confirmBookings.bind(providerController));
router.get("/jobDetails/:bookingId", AuthMiddleware([RoleEnum.Provider]), providerController.jobDetails.bind(providerController));
router.get("/job-history", AuthMiddleware([RoleEnum.Provider]), providerController.getJobHistory.bind(providerController));
router.post("/arrival-otp/:bookingId", AuthMiddleware([RoleEnum.Provider]), providerController.arrivalOtp.bind(providerController));
router.post("/verify-arrivalOtp", validateRequest(otpSchema), AuthMiddleware([RoleEnum.Provider]), providerController.verifyArrivalOtp.bind(providerController));
router.get("/availability-time", AuthMiddleware([RoleEnum.Provider]), providerController.getAvailabilityTime.bind(providerController));
router.post("/schedule-availability-time", validateRequest(workTimeSchema), AuthMiddleware([RoleEnum.Provider]), providerController.scheduleAvailabilityTime.bind(providerController));
router.patch("/toggle-availability", validateRequest(daySchema), AuthMiddleware([RoleEnum.Provider]), providerController.toggleAvailability.bind(providerController));
export default router;


