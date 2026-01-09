import {db} from '../src/config/database.js';

async function initializeDatabase() {
    console.log('Initializing database...');

    const client = await db.getClient();

    try {
        await client.query('DROP TABLE IF EXISTS smoke_logs CASCADE');
        await client.query('DROP TABLE IF EXISTS tips CASCADE');

        await client.query(`
            CREATE TABLE smoke_logs
            (
                id         SERIAL PRIMARY KEY,
                date       TIMESTAMP    NOT NULL,
                count      INTEGER      NOT NULL CHECK (count > 0),
                reason     VARCHAR(100) NOT NULL,
                notes      TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE TABLE tips
            (
                id         SERIAL PRIMARY KEY,
                category   VARCHAR(50) NOT NULL,
                text       TEXT        NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE INDEX idx_smoke_logs_date ON smoke_logs (date);
            CREATE INDEX idx_smoke_logs_reason ON smoke_logs (reason);
        `);

        await client.query(`
            INSERT INTO smoke_logs (date, count, reason, notes)
            VALUES (NOW() - INTERVAL '1 day', 2, 'stress', 'Работа'),
                   (NOW() - INTERVAL '2 days', 1, 'habit', 'После обеда'),
                   (NOW() - INTERVAL '3 days', 3, 'social', 'С друзьями'),
                   (NOW() - INTERVAL '4 days', 1, 'boredom', 'Дома вечером'),
                   (NOW() - INTERVAL '5 days', 2, 'stress', 'Важная встреча')
        `);

        await client.query(`
            INSERT INTO tips (category, text)
            VALUES ('general', 'Сделайте 10 глубоких вдохов для снятия стресса'),
                   ('general', 'Выпейте стакан воды когда хочется курить'),
                   ('health', 'Каждая невыкуренная сигарета улучшает ваше здоровье'),
                   ('motivation', 'Запомните: каждая сигарета отнимает 11 минут жизни'),
                   ('alternative', 'Пожуйте жевательную резинку или съешьте мятную конфету')
        `);

        console.log('Database initialized with sample data!');

        const logsCount = await client.query('SELECT COUNT(*) FROM smoke_logs');
        const tipsCount = await client.query('SELECT COUNT(*) FROM tips');

        console.log(`Smoke logs: ${logsCount.rows[0].count}`);
        console.log(`Tips: ${tipsCount.rows[0].count}`);

    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    } finally {
        client.release();
        await db.close();
    }
}

initializeDatabase().catch(console.error);