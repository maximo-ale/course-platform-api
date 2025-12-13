import pool from "../../config/db.js";

interface UserRegister{
    name: string,
    email: string,
    password: string,
    role?: 'user' | 'teacher' | 'admin',
}

interface UserInfo{
    id: number,
    name: string,
    email: string,
    password: string,
    role: 'user' | 'teacher' | 'admin',
}
interface ProtectedUserInfo{
    id: number,
    name: string,
    role: 'user' | 'teacher' | 'admin',
}
class AuthRepository{
    async registerUser(data: UserRegister): Promise<ProtectedUserInfo>{
        const {name, email, password, role} = data;
        const user = await pool.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `, [name, email, password, role]);
        return user.rows[0];
    }

    async findUserByNameOrEmail(name?: string, email?: string): Promise<UserInfo>{
        const user = await pool.query(`
            SELECT * FROM users
            WHERE name = $1 OR email = $2
            `, [name, email]);
        return user.rows[0];
    }

    async findUserById(userId: number): Promise<ProtectedUserInfo>{
        const user = await pool.query(`
            SELECT * FROM users
            WHERE id = $1;
            `, [userId]);
        return user.rows[0];
    }

    async deleteUser(userId: number): Promise<ProtectedUserInfo>{
        const user = await pool.query(`
            DELETE FROM users
            WHERE id = $1
            `, [userId]);
        return user.rows[0];
    }
}

export default new AuthRepository();