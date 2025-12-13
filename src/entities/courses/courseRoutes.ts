import express from 'express';
const router = express.Router();

import controller from './courseController.js';
import {auth, onlyAdmin, teacherAuth} from '../../middlewares/authMiddleware.js';
import teacherValidator from '../../middlewares/teacherValidator.js';

import validate from '../../middlewares/validateRequest.js';
import { createCourseSchema, getCourseByIDSchema, getCoursesSchema, updateUserSchema, removeUserSchema } from './courseSchemas.js';

router.get('/',
    validate(getCoursesSchema, 'query'),
    auth,
    controller.getCoursesForUsers);

router.get('/getAll',
    auth, onlyAdmin,
    controller.getCourses);

router.get('/get/:courseId',
    validate(getCourseByIDSchema, 'params'),
    auth,
    controller.getCourse);

router.post('/create',
    validate(createCourseSchema, 'body'),
    auth, teacherAuth,
    controller.createCourse);

router.delete('/delete/:courseId',
    validate(getCourseByIDSchema, 'params'),
    auth, teacherAuth, teacherValidator('courseId'),
    controller.deleteCourse);

router.delete('/remove/:courseId/student/:userId',
    validate(removeUserSchema, 'params'),
    auth, teacherAuth, teacherValidator('courseId'),
    controller.removeStudent);
    
router.patch('/update/:courseId',
    validate(updateUserSchema, 'body'), validate(getCourseByIDSchema, 'params'),
    auth, teacherAuth, teacherValidator('courseId'),
    controller.updateCourse);

export default router;