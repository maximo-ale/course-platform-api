import pool from '../config/db.js';
import { AppError } from './errors.js';

const waitForDB = async (tries: number = 20, delay: number = 3000) => {
    for (let i = 0; i < tries; i++){
        try {
            await pool.query('SELECT 1');
            console.log('DB connected successfully');
            return;
        } catch (err) {
            console.log(`Could not connect to DB on attempt ${i}. Retrying in ${delay/1000}s`);
            await new Promise(r => setTimeout(r, delay));
        }
    }

    throw new AppError(500, 'Could not connect to DB');
}

export default waitForDB;