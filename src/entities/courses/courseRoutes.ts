import express from 'express';
const router = express.Router();

import controller from './courseController.ts';
import {auth, onlyAdmin, teacherAuth} from '../../middlewares/authMiddleware.ts';
import teacherValidator from '../../middlewares/teacherValidator.ts';

import validate from '../../middlewares/validateRequest.ts';
import { createCourseSchema, getCourseByIDSchema, getCoursesSchema, updateUserSchema, removeUserSchema } from './courseSchemas.ts';

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