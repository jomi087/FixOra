import express from 'express'
import { userAuthMiddleware,adminController } from '../../main/dependencyInjector.js'


const router = express.Router()
router.get('/customer-management',userAuthMiddleware, adminController.getCustomers.bind(adminController));
router.get('/provider-management', userAuthMiddleware, adminController.getProviders.bind(adminController));

export default router