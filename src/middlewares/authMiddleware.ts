import jwt from 'jsonwebtoken';
import type {Request, Response, NextFunction} from 'express';
import { AppError, ForbiddenError, NotAuthorizedError } from '../utils/errors.js';
import authDB from '../entities/auth/authRepository.js';

interface JWTCustom extends jwt.JwtPayload{
    userId: string,
}
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header('Authorization')?.split(" ")[1];
    if (!token || token === 'null' || token === 'undefined') {
        throw new NotAuthorizedError('No token');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTCustom;
        req.userId = decoded.userId;
        req.role = decoded.role;

        // Only users from the DB
        const userInDB = await authDB.findUserById(parseInt(decoded.userId));
        if (!userInDB){
            throw new ForbiddenError('Invalid token');
        }

        next();
    } catch {
        throw new ForbiddenError('Invalid token');
    }
}
export const teacherAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.role !== 'teacher' && req.role !== 'admin'){
        return res.status(403).json({message: 'Not authorized'});
    }
    next();
}
export const onlyAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.role !== "admin"){
        return res.status(403).json({message: 'Not authorized'});
    }
    next();
}