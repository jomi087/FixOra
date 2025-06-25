import express from 'express'
import { userAuthMiddleware,adminController } from '../../main/dependencyInjector.js'
import { validateRequest } from '../middleware/validateRequest.js';
import { roleSchema } from '../validations/roleSchema.js';

const router = express.Router()

// router.get('/userManagement', userAuthMiddleware, (req, res, next) => adminController.getUsersByRole(req, res, next)) //instead of writting like this there is a simplyfy version shown below
router.get('/user-management',validateRequest(roleSchema,"query"), userAuthMiddleware, adminController.getUsersByRole.bind(adminController));

export default router