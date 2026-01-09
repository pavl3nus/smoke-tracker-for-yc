import {Router} from 'express';
import {smokeLogController} from '../controllers/smokeLog.controller.js';

const router = Router();

router.get('/', smokeLogController.getAll.bind(smokeLogController));
router.get('/:id', smokeLogController.getById.bind(smokeLogController));
router.post('/', smokeLogController.create.bind(smokeLogController));
router.put('/:id', smokeLogController.update.bind(smokeLogController));
router.delete('/:id', smokeLogController.delete.bind(smokeLogController));

export default router;