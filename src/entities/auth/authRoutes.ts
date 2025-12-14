import express from'express';
const router = express.Router();

import controller from './authController.js';
import {auth, onlyAdmin} from '../../middlewares/authMiddleware.js';

import validate from '../../middlewares/validateRequest.js';
import { idSchema, loginSchema, registerSchema } from './authSchemas.js';

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