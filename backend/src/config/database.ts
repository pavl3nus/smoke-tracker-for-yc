import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const {Pool} = pg;

const getSSLConfig = () => {
    if (process.env.DB_SSL !== 'true') return false;

    try {
        const caPath = process.env.DB_CA_PATH || '/app/.postgresql/root.crt';
        if (fs.existsSync(caPath)) {
            return {
                rejectUnauthorized: true,
                ca: fs.readFileSync(caPath).toString(),
            };
        }
        console.warn('SSL certificate not found, disabling SSL verification');
        return {rejectUnauthorized: false};
    } catch (error) {
        console.error('SSL config error:', error);
        return {rejectUnauthorized: false};
    }
};

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: getSSLConfig(),
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

export const db = {
    async query(text: string, params?: any[]) {
        return await pool.query(text, params);
    },

    async getClient() {
        return await pool.connect();
    },

    async checkConnection() {
        try {
            await pool.query('SELECT 1');
            return true;
        } catch {
            return false;
        }
    },

    async close() {
        await pool.end();
    }
};