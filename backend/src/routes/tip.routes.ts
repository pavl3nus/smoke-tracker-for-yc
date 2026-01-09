import {Router} from 'express';
import {tipController} from '../controllers/tip.controller.js';

const router = Router();

router.get('/', tipController.getAll.bind(tipController));
router.get('/random', tipController.getRandom.bind(tipController));
router.get('/categories', tipController.getCategories.bind(tipController));

export default router;