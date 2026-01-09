import {Router} from 'express';
import {statsController} from '../controllers/stats.controller.js';

const router = Router();

router.get('/daily', statsController.getDailyStats.bind(statsController));
router.get('/monthly', statsController.getMonthlyStats.bind(statsController));
router.get('/summary', statsController.getSummary.bind(statsController));

export default router;