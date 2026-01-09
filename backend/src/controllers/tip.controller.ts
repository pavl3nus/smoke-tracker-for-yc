import {Request, Response} from 'express';
import {tipRepository} from '../repositories/tip.repository.js';

export class TipController {
    async getAll(req: Request, res: Response) {
        try {
            const {limit, category} = req.query;

            let tips;
            if (category) {
                tips = await tipRepository.findByCategory(category as string);
            } else if (limit) {
                tips = await tipRepository.findAll(parseInt(limit as string));
            } else {
                tips = await tipRepository.findAll();
            }

            res.json(tips);
        } catch (error) {
            console.error('Error fetching tips:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }

    async getRandom(req: Request, res: Response) {
        try {
            const {limit = '5'} = req.query;
            const tips = await tipRepository.findRandom(parseInt(limit as string));
            
            if (tips.length === 0) {
                const staticTips = [
                    {
                        id: 1,
                        category: 'general',
                        text: 'Сделайте 10 глубоких вдохов для снятия стресса',
                        created_at: new Date(),
                    },
                    {
                        id: 2,
                        category: 'general',
                        text: 'Выпейте стакан воды когда хочется курить',
                        created_at: new Date(),
                    },
                ];
                return res.json(staticTips);
            }

            res.json(tips);
        } catch (error) {
            console.error('Error fetching random tips:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }

    async getCategories(req: Request, res: Response) {
        try {
            const categories = await tipRepository.getCategories();
            res.json(categories);
        } catch (error) {
            console.error('Error fetching tip categories:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }
}

export const tipController = new TipController();