import express from 'express';
const router = express.Router();

import controller from './userController.js';
import {auth, teacherAuth} from '../../middlewares/authMiddleware.js';

import validate from '../../middlewares/validateRequest.js';
import { courseIdSchema } from './userSchemas.js';

router.post('/enroll/:courseId',
    validate(courseIdSchema, 'params'),
    auth,
    controller.enroll);

router.get('/courses',
    auth,
    controller.showEnrolled);

router.get('/created',
    auth, teacherAuth,
    controller.showCreated);
    
router.delete('/leave/:courseId',
    validate(courseIdSchema, 'params'),
    auth,
    controller.leave);

export default router;