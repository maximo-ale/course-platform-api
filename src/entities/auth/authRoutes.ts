import express from'express';
const router = express.Router();

import controller from './authController.ts';
import {auth, onlyAdmin} from '../../middlewares/authMiddleware.ts';

import validate from '../../middlewares/validateRequest.ts';
import { idSchema, loginSchema, registerSchema } from './authSchemas.ts';

router.post('/register',
    validate(registerSchema, 'body'),
    controller.register);

router.post('/login',
    validate(loginSchema, 'body'),
    controller.login);

router.delete('/delete/:userId',
    validate(idSchema, 'params'),
    auth, onlyAdmin,
    controller.deleteUser);

export default router;