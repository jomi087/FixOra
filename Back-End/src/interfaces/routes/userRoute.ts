import express from 'express'
import { userAuthMiddleware, userController } from '../../main/dependencyInjector.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { editProfileSchema } from '../validations/editProfileSchema.js'
import { verifyPasswordSchema } from '../validations/verifyPasswordSchema.js'
import { resetPasswordSchema } from '../validations/resetPasswordSchema.js'
import upload from '../middleware/upload.js'
import { validateKYCRequest } from '../validations/kycRequestSchema.js'
const router = express.Router()

router.get('/services', userAuthMiddleware, (req,res,next)=>userController.activeServices(req, res, next))
router.get('/providers',userAuthMiddleware, (req,res,next)=>userController.activeProviders(req, res, next) )
router.post(
    '/provider-kyc',
    userAuthMiddleware,
    upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "idCard", maxCount: 1 },
        { name: "educationCertificate", maxCount: 1 },
        { name : "experienceCertificate", maxCount : 1 }
    ]),
    validateKYCRequest,
    (req, res, next) => userController.kycApplication(req, res, next))

router.patch('/editProfile', validateRequest(editProfileSchema), userAuthMiddleware, (req, res, next) => userController.editProfile(req, res, next))
router.post('/verifyPassword', validateRequest(verifyPasswordSchema), userAuthMiddleware, (req,res,next)=>userController.verifyPassword(req, res, next))
router.patch('/change-password',validateRequest(resetPasswordSchema), userAuthMiddleware, (req,res,next)=>userController.changePassword(req, res, next))


export default router