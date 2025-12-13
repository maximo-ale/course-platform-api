import { BadRequestError, NotAuthorizedError, NotFoundError } from '../../utils/errors.ts';
import bcrypt from 'bcrypt';
import authDB from './authRepository.ts';
import generateToken from '../../utils/generateToken.ts';

interface UserRegister{
    name: string,
    email: string,
    password: string,
    role?: 'user' | 'teacher' | 'admin',
}

interface UserLogin{
    name?: string,
    email?: string,
    password: string,
}

interface ProtectedUserInfo{
    id: number,
    name: string,
    role: 'user' | 'teacher' | 'admin',
}

class AuthService{
    async register(data: UserRegister): Promise<ProtectedUserInfo>{
        const {name, email, password, role} = data;

        // Hash password to protect sensitive data
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await authDB.registerUser({
            name,
            email,
            password: hashedPassword,
            role,
        });

        return newUser;
    }

    async login(data: UserLogin): Promise<string>{
        const {name, email, password} = data;

        if (!name && !email){
            throw new BadRequestError('At least name or email must be provided');
        }
        
        // Find user by name or email
        const user = await authDB.findUserByNameOrEmail(name, email);

        if (!user){
            throw new NotFoundError('User not found');
        }

        // Compare given password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new NotAuthorizedError('Password does not match');
        }

        // Generate JWT
        const token: string = generateToken({userId: user.id.toString(), role: user.role});

        return token;
    }

    async deleteUser(userId: number): Promise<ProtectedUserInfo>{
        const userToDelete = await authDB.findUserById(userId);
    
        if (!userToDelete){
            throw new NotFoundError('User not found');
        }

        const deletedUser = await authDB.deleteUser(userId);
        return deletedUser;
    }
}

export default new AuthService();