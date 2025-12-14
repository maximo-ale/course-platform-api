import pool from '../config/db.js';
import { AppError } from './errors.js';

const waitForDB = async (tries: number = 10, delay: number = 2000) => {
    for (let i = 0; i < tries; i++){
        try {
            await pool.query('SELECT 1');
            console.log('DB connected successfully');
            return;
        } catch {
            console.log(`Could not connect to DB on attempt ${i}`);
            await new Promise(r => setTimeout(r, delay));
        }
    }

    throw new AppError(500, 'Could not connect to DB');
}

export default waitForDB;