import pool from './src/utils/db.js';
import Logger from './src/utils/logger.js';

const createTables = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS requests (
            id SERIAL PRIMARY KEY,
            request_id VARCHAR(255) NOT NULL,
            serial_number INT,
            product_name VARCHAR(255),
            input_image_urls TEXT,
            output_image_urls TEXT,
            status VARCHAR(50)
        );
    `;

    try {
        await pool.query(createTableQuery);
        Logger.info('Table created successfully');
    } catch (err) {
        Logger.error('Error creating table:', err.message);
    } finally {
        pool.end();
    }
};

createTables();
