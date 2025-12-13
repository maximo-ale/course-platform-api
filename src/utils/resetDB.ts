import pool from '../config/db.ts';

const resetDB = async() => {
    // await pool.query(`DROP TABLE IF EXISTS users CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS courses CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS users_courses CASCADE`);
}

export default resetDB;