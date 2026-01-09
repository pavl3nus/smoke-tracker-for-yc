import {Router} from 'express';
import smokeLogRoutes from './smokeLog.routes.js';
import tipRoutes from './tip.routes.js';
import statsRoutes from './stats.routes.js';
import {db} from '../config/database.js';
import {smokeLogRepository} from '../repositories/smokeLog.repository.js';

const router = Router();

router.get('/health', async (req, res) => {
    try {
        const isConnected = await db.checkConnection();
        res.json({
            status: isConnected ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            database: isConnected ? 'connected' : 'disconnected',
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const totalCount = await smokeLogRepository.getTotalCount();
        res.json({
            message: 'Smoke Tracker API',
            version: '1.0.0',
            database: 'PostgreSQL',
            records: totalCount,
            endpoints: [
                'GET    /api/health',
                'GET    /api/smoke-logs',
                'POST   /api/smoke-logs',
                'GET    /api/smoke-logs/:id',
                'PUT    /api/smoke-logs/:id',
                'DELETE /api/smoke-logs/:id',
                'GET    /api/stats/daily',
                'GET    /api/stats/monthly',
                'GET    /api/stats/summary',
                'GET    /api/tips',
                'GET    /api/tips/random',
                'GET    /api/tips/categories',
            ],
        });
    } catch (error) {
        res.status(500).json({error: 'Failed to get API info'});
    }
});

router.use('/smokeLogs', smokeLogRoutes);
router.use('/tips', tipRoutes);
router.use('/stats', statsRoutes);

export default router;