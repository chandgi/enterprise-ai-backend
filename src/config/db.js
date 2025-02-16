// config/db.js
import pkg from 'pg';
import ENV from "./env.js";


const { Pool } = pkg;

const pool = new Pool({
    user: ENV.DB_USER || 'postgres',
    host: ENV.DB_HOST || 'localhost',
    database: ENV.DB_NAME || 'postgres',
    password: ENV.DB_PASSWORD || 'password',
    port: ENV.DB_PORT || 5432
});

export const connectDB = async () => {
    try {
        await pool.connect();
        console.log('Connected to PostgreSQL');
    } catch (error) {
        console.error('PostgreSQL connection failed:', error);
    }
};

export default pool;