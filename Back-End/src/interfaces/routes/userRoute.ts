import express from 'express'
import { userAuthMiddleware, userController } from '../../main/dependencyInjector.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { editProfileSchema } from '../validations/editProfileSchema.js'
import { verifyPasswordSchema } from '../validations/verifyPasswordSchema.js'
import { resetPasswordSchema } from '../validations/resetPasswordSchema.js'
const router = express.Router()

router.get('/services' , userAuthMiddleware ,(req,res,next)=>userController.activeServices(req, res, next))
router.patch('/editProfile', validateRequest(editProfileSchema), userAuthMiddleware, (req, res, next) => userController.editProfile(req, res, next))
router.post('/verifyPassword', validateRequest(verifyPasswordSchema), userAuthMiddleware, (req,res,next)=>userController.verifyPassword(req, res, next))
router.patch('/change-password',validateRequest(resetPasswordSchema), userAuthMiddleware, (req,res,next)=>userController.changePassword(req, res, next))

export default router