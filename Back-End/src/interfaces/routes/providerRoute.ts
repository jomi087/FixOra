import express from 'express'
import { validateRequest } from '../middleware/validateRequest.js';
import { bookingStatusSchema } from '../validations/bookingSchema.js';
import { providerController, AuthMiddleware } from '../../main/dependencyInjector.js';
import { RoleEnum } from '../../shared/Enums/Roles.js';

const router = express.Router();

router.patch('/booking/:bookingId/status', validateRequest(bookingStatusSchema), AuthMiddleware([RoleEnum.Provider]), providerController.updateBookingStatus.bind(providerController))
router.get('/bookings', AuthMiddleware([RoleEnum.Provider]), providerController.bookings.bind(providerController))
export default router


