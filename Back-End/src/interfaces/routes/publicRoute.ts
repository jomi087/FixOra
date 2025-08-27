import express from 'express'
import { publicController } from '../../main/dependencyInjector.js';

const router = express.Router();
router.get('/landing-data', publicController.getLandingData.bind(publicController))

export default router