import express from 'express'
import { userAuthMiddleware, adminController } from '../../main/dependencyInjector.js'
import upload from '../middleware/upload.js';
import { validateCategory } from '../validations/categorySchema.js';

const router = express.Router()
router.get('/customer-management', userAuthMiddleware, adminController.getCustomers.bind(adminController));
router.patch('/customer-management/:userId',userAuthMiddleware,adminController.toggleUserStatus.bind(adminController))
router.get('/provider-management', userAuthMiddleware, adminController.getProviders.bind(adminController));
router.get('/service-management',  userAuthMiddleware, adminController.getServices.bind(adminController))
router.post('/service-management', userAuthMiddleware, upload.any(), validateCategory, adminController.addService.bind(adminController))
router.patch('/service-management/:categoryId',userAuthMiddleware,adminController.toggleCategoryStatus.bind(adminController))
export default router