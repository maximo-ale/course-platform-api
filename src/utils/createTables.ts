import pool from "../config/db.js";

const createTables = async() => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(10) CHECK(role IN ('user', 'teacher', 'admin'))
        )`
    );
    
    await pool.query(`
        CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(25) NOT NULL UNIQUE,
        description VARCHAR(4000),
        teacher INTEGER REFERENCES users(id),
        price INTEGER CHECK(price >= 0),
        category VARCHAR(20)[],
        published BOOLEAN DEFAULT TRUE
        )`
    );

    await pool.query(`
        CREATE TABLE IF NOT EXISTS users_courses (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, course_id)
        )
        `
    );
}

export default createTables;