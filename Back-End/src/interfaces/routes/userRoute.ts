import express from 'express'
import { AuthMiddleware, userController } from '../../main/dependencyInjector.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { bookingIdSchema, bookingRequestSchema } from '../validations/bookingSchema.js'
import { resetPasswordSchema, verifyPasswordSchema } from '../validations/authSchema.js'
import { validateKYCRequest } from '../validations/kycSchema.js'
import { editProfileSchema } from '../validations/profileSchema.js'

import upload from '../middleware/upload.js'
import { RoleEnum } from '../../shared/Enums/Roles.js'

const router = express.Router()

//Services Section
router.get('/services', AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.activeServices(req, res, next))

//Providers  Section
router.get('/providers', AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.activeProviders(req, res, next))
router.post(
    '/provider-kyc',
    AuthMiddleware([RoleEnum.Customer]),
    upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "idCard", maxCount: 1 },
        { name: "educationCertificate", maxCount: 1 },
        { name : "experienceCertificate", maxCount : 1 }
    ]),
    validateKYCRequest,
    (req, res, next) => userController.kycApplication(req, res, next)
)
router.get('/provider/bookings/:id',AuthMiddleware([RoleEnum.Customer]), (req,res,next)=>userController.providerBookings(req, res, next) )
router.post('/provider/booking',validateRequest(bookingRequestSchema),AuthMiddleware([RoleEnum.Customer]), (req,res,next)=>userController.createBooking(req, res, next) )
router.post('/create-checkout-session', validateRequest(bookingIdSchema), AuthMiddleware([RoleEnum.Customer]),(req,res,next)=>userController.initiatePayment(req, res, next))

//Profile Section
router.patch('/editProfile', validateRequest(editProfileSchema), AuthMiddleware([RoleEnum.Customer]), (req, res, next) => userController.editProfile(req, res, next))
router.post('/verifyPassword', validateRequest(verifyPasswordSchema), AuthMiddleware([RoleEnum.Customer]), (req,res,next)=>userController.verifyPassword(req, res, next))
router.patch('/change-password',validateRequest(resetPasswordSchema), AuthMiddleware([RoleEnum.Customer]), (req,res,next)=>userController.changePassword(req, res, next))


export default router