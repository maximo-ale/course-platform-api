import { Pool } from 'pg';

console.log('User: ', process.env.POSTGRES_USER)
console.log('Password: ', process.env.POSTGRES_PASSWORD)
console.log('Host: ', process.env.PG_HOST)
console.log('Port: ', process.env.PG_PORT)
console.log('Database: ', process.env.POSTGRES_DB)

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    database: process.env.POSTGRES_DB,
});

export default pool;