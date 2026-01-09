import {Request, Response} from 'express';
import {smokeLogRepository} from '../repositories/smokeLog.repository.js';
import {
    CreateSmokeLogInput,
    createSmokeLogSchema,
    updateSmokeLogSchema
} from '../models/smokeLog.model.js';

export class SmokeLogController {
    async getAll(req: Request, res: Response) {
        try {
            const {reason, limit, offset, start_date, end_date} = req.query;

            const logs = await smokeLogRepository.findAll({
                reason: reason as string,
                limit: limit ? parseInt(limit as string) : undefined,
                offset: offset ? parseInt(offset as string) : undefined,
                startDate: start_date ? new Date(start_date as string) : undefined,
                endDate: end_date ? new Date(end_date as string) : undefined,
            });

            res.json(logs);
        } catch (error) {
            console.error('Error fetching smoke logs:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({error: 'Invalid ID format'});
            }

            const log = await smokeLogRepository.findById(id);
            if (!log) {
                return res.status(404).json({error: 'Smoke log not found'});
            }

            res.json(log);
        } catch (error) {
            console.error('Error fetching smoke log:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }

    async create(req: Request, res: Response) {
        try {
            const validationResult = createSmokeLogSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    error: 'Validation error',
                    details: validationResult.error.format()
                });
            }

            const data: CreateSmokeLogInput = validationResult.data;
            const log = await smokeLogRepository.create({
                ...data,
                date: data.date instanceof Date ? data.date : new Date(data.date),
            });

            res.status(201).json(log);
        } catch (error) {
            console.error('Error creating smoke log:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({error: 'Invalid ID format'});
            }

            const validationResult = updateSmokeLogSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    error: 'Validation error',
                    details: validationResult.error.format()
                });
            }

            const data = validationResult.data;
            const updatedLog = await smokeLogRepository.update(id, {
                ...data,
                date: data.date ? (data.date instanceof Date ? data.date : new Date(data.date)) : undefined,
            });

            if (!updatedLog) {
                return res.status(404).json({error: 'Smoke log not found'});
            }

            res.json(updatedLog);
        } catch (error) {
            console.error('Error updating smoke log:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({error: 'Invalid ID format'});
            }

            const deleted = await smokeLogRepository.delete(id);
            if (!deleted) {
                return res.status(404).json({error: 'Smoke log not found'});
            }

            res.status(204).send();
        } catch (error) {
            console.error('Error deleting smoke log:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }
}

export const smokeLogController = new SmokeLogController();