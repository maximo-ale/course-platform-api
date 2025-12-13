import express from 'express';
const router = express.Router();

import controller from './userController.ts';
import {auth, teacherAuth} from '../../middlewares/authMiddleware.ts';

import validate from '../../middlewares/validateRequest.ts';
import { courseIdSchema } from './userSchemas.ts';

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