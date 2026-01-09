import {Request, Response} from 'express';
import {smokeLogRepository} from '../repositories/smokeLog.repository.js';

export class StatsController {
    async getDailyStats(req: Request, res: Response) {
        try {
            const {start_date, end_date} = req.query;

            const stats = await smokeLogRepository.getDailyStats(
                start_date ? new Date(start_date as string) : undefined,
                end_date ? new Date(end_date as string) : undefined
            );

            res.json(stats);
        } catch (error) {
            console.error('Error fetching daily stats:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }

    async getMonthlyStats(req: Request, res: Response) {
        try {
            const stats = await smokeLogRepository.getMonthlyStats();
            res.json(stats);
        } catch (error) {
            console.error('Error fetching monthly stats:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }

    async getSummary(req: Request, res: Response) {
        try {
            const [dailyStats, monthlyStats, totalCount] = await Promise.all([
                smokeLogRepository.getDailyStats(),
                smokeLogRepository.getMonthlyStats(),
                smokeLogRepository.getTotalCount(),
            ]);

            const today = new Date().toISOString().split('T')[0];
            const todayStats = dailyStats.find(stat => stat.day === today);

            res.json({
                total_records: totalCount,
                today: todayStats || {total_smokes: 0, entries: 0},
                daily_stats: dailyStats,
                monthly_stats: monthlyStats,
            });
        } catch (error) {
            console.error('Error fetching summary:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }
}

export const statsController = new StatsController();