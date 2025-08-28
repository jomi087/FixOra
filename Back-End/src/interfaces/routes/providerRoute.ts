import express from 'express'
import { validateRequest } from '../middleware/validateRequest';
import { bookingStatusSchema } from '../validations/bookingSchema';
import { providerController, AuthMiddleware } from '../../main/dependencyInjector';
import { RoleEnum } from '../../shared/Enums/Roles';

const router = express.Router();

router.patch('/booking/:bookingId/status', validateRequest(bookingStatusSchema), AuthMiddleware([RoleEnum.Provider]), providerController.respondToBookingRequest.bind(providerController))
router.get('/bookings', AuthMiddleware([RoleEnum.Provider]), providerController.bookings.bind(providerController))
export default router


