import {db} from '../config/database.js';
import {
    SmokeLog,
    CreateSmokeLogDTO,
    UpdateSmokeLogDTO
} from '../models/smokeLog.model.js';

export class SmokeLogRepository {
    async findAll(options?: {
        limit?: number;
        offset?: number;
        reason?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<SmokeLog[]> {
        let query = 'SELECT * FROM smoke_logs WHERE 1=1';
        const params: any[] = [];
        let paramIndex = 1;

        if (options?.reason) {
            query += ` AND reason = $${paramIndex}`;
            params.push(options.reason);
            paramIndex++;
        }

        if (options?.startDate) {
            query += ` AND date >= $${paramIndex}`;
            params.push(options.startDate);
            paramIndex++;
        }

        if (options?.endDate) {
            query += ` AND date <= $${paramIndex}`;
            params.push(options.endDate);
            paramIndex++;
        }

        query += ' ORDER BY date DESC';

        if (options?.limit) {
            query += ` LIMIT $${paramIndex}`;
            params.push(options.limit);
            paramIndex++;
        }

        if (options?.offset) {
            query += ` OFFSET $${paramIndex}`;
            params.push(options.offset);
            paramIndex++;
        }

        const result = await db.query<SmokeLog>(query, params);
        return result.rows;
    }

    async findById(id: number): Promise<SmokeLog | null> {
        const result = await db.query<SmokeLog>(
            'SELECT * FROM smoke_logs WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    async create(data: CreateSmokeLogDTO): Promise<SmokeLog> {
        const result = await db.query<SmokeLog>(
            `INSERT INTO smoke_logs (date, count, reason, notes)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [data.date, data.count, data.reason, data.notes || null]
        );
        return result.rows[0];
    }

    async update(id: number, data: UpdateSmokeLogDTO): Promise<SmokeLog | null> {
        const fields = [];
        const values = [];
        let paramIndex = 1;

        if (data.date !== undefined) {
            fields.push(`date = $${paramIndex}`);
            values.push(data.date);
            paramIndex++;
        }

        if (data.count !== undefined) {
            fields.push(`count = $${paramIndex}`);
            values.push(data.count);
            paramIndex++;
        }

        if (data.reason !== undefined) {
            fields.push(`reason = $${paramIndex}`);
            values.push(data.reason);
            paramIndex++;
        }

        if (data.notes !== undefined) {
            fields.push(`notes = $${paramIndex}`);
            values.push(data.notes);
            paramIndex++;
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        fields.push(`updated_at = NOW()`);
        values.push(id);

        const result = await db.query<SmokeLog>(
            `UPDATE smoke_logs
             SET ${fields.join(', ')}
             WHERE id = $${paramIndex} RETURNING *`,
            values
        );

        return result.rows[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await db.query(
            'DELETE FROM smoke_logs WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rowCount > 0;
    }

    async getTotalCount(): Promise<number> {
        const result = await db.query<{ count: string }>(
            'SELECT COUNT(*) FROM smoke_logs'
        );
        return parseInt(result.rows[0].count);
    }

    async getDailyStats(startDate?: Date, endDate?: Date): Promise<any[]> {
        let query = `
            SELECT
                DATE (date) as day, SUM (count) as total_smokes, COUNT (*) as entries, ARRAY_AGG(reason) as reasons
            FROM smoke_logs
            WHERE 1=1
        `;

        const params: any[] = [];
        let paramIndex = 1;

        if (startDate) {
            query += ` AND date >= $${paramIndex}`;
            params.push(startDate);
            paramIndex++;
        }

        if (endDate) {
            query += ` AND date <= $${paramIndex}`;
            params.push(endDate);
            paramIndex++;
        }

        query += `
      GROUP BY DATE(date)
      ORDER BY day DESC
      LIMIT 30
    `;

        const result = await db.query(query, params);
        return result.rows;
    }

    async getMonthlyStats(): Promise<any[]> {
        const result = await db.query(`
            SELECT TO_CHAR(date, 'YYYY-MM') as month,
        SUM(count) as total_smokes,
        COUNT(*) as entries,
        ROUND(AVG(count), 2) as avg_per_day
            FROM smoke_logs
            GROUP BY TO_CHAR(date, 'YYYY-MM')
            ORDER BY month DESC
                LIMIT 12
        `);
        return result.rows;
    }
}

export const smokeLogRepository = new SmokeLogRepository();