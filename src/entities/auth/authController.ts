import type { Request, Response } from 'express';
import authService from './authService.js';

class AuthController{
    async register(req: Request, res: Response){
        const user = await authService.register(req.body);

        res.status(201).json({
            message: 'User saved successfully',
            user,
        });
    }

    async login(req: Request, res: Response){
        const token = await authService.login(req.body);
        
        res.status(200).json({ token });
    }

    async deleteUser(req: Request, res: Response){
        const deletedUser = await authService.deleteUser(parseInt(req.params.userId));

        res.status(200).json({
            message: 'User deleted successfully',
            deletedUser,
        });
    }
}

export default new AuthController();