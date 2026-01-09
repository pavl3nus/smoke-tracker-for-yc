import {db} from '../config/database.js';
import {Tip} from '../models/tip.model.js';

export class TipRepository {
    async findAll(limit?: number): Promise<Tip[]> {
        const query = `
            SELECT *
            FROM tips
            ORDER BY created_at DESC
                ${limit ? `LIMIT ${limit}` : ''}
        `;
        const result = await db.query<Tip>(query);
        return result.rows;
    }

    async findRandom(limit: number = 5): Promise<Tip[]> {
        const result = await db.query<Tip>(
            'SELECT * FROM tips ORDER BY RANDOM() LIMIT $1',
            [limit]
        );
        return result.rows;
    }

    async findByCategory(category: string): Promise<Tip[]> {
        const result = await db.query<Tip>(
            'SELECT * FROM tips WHERE category = $1 ORDER BY created_at DESC',
            [category]
        );
        return result.rows;
    }

    async create(category: string, text: string): Promise<Tip> {
        const result = await db.query<Tip>(
            'INSERT INTO tips (category, text) VALUES ($1, $2) RETURNING *',
            [category, text]
        );
        return result.rows[0];
    }

    async getCategories(): Promise<string[]> {
        const result = await db.query<{ category: string }>(
            'SELECT DISTINCT category FROM tips ORDER BY category'
        );
        return result.rows.map(row => row.category);
    }
}

export const tipRepository = new TipRepository();