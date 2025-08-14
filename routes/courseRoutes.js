const express = require('express');
const router = express.Router();
const {getCoursesForUsers, getCourses, getCourse, createCourse, deleteCourse, modifyCourse, deleteStudent} = require('../controllers/courseController');
const {auth, onlyAdmin, teacherAuth} = require('../middlewares/authMiddleware');
const teacherValidator = require('../middlewares/teacherValidator');

const { body, param, query } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');

router.get('/get',
    query('title').optional().isString().bail().withMessage('Title must be a string').trim().notEmpty().withMessage('Title cannot be empty'),
    query('teacher').optional().isMongoId().withMessage('Invalid ID'),
    query('category').optional().isString().bail().withMessage('Category must be a string').trim().notEmpty().withMessage('Category cannot be empty'),
    query('sort').optional().isString().bail().withMessage('Sort must be a string').trim().notEmpty().withMessage('Invalid sort value'),
    query('page').optional().isInt({ min: 1 }).withMessage('Invalid page value. Must be >= 1'),
    query('limit').optional().isInt({ min: 1, max: 10 }).withMessage('Invalid limit value, try a number between 1-10'),
    validateRequest, auth, getCoursesForUsers);

router.get('/getAll', auth, onlyAdmin, getCourses);

router.get('/get/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    validateRequest, auth, getCourse);

router.post('/create',
    body('title').isString().withMessage('Title must be a string').trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').isString().withMessage('Description must be a string').trim().notEmpty().withMessage('Description cannot be empty'),
    body('category').isString().withMessage('Category must be a string').trim().notEmpty().withMessage('Category cannot be empty'),
    body('price').exists().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('published').optional().isBoolean().withMessage('Published must be a boolean value'),
    validateRequest, auth, teacherAuth, createCourse);

router.delete('/delete/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    validateRequest, auth, teacherAuth, teacherValidator('id'), deleteCourse);

router.delete('/delete/:courseId/student/:userId',
    param('courseId').isMongoId().withMessage('Invalid course ID'),
    param('userId').isMongoId().withMessage('Invalid user ID'),
    validateRequest, auth, teacherAuth, teacherValidator('courseId'), deleteStudent);

router.patch('/modify/:id', 
    param('id').isMongoId().withMessage('Invalid course ID'),
    body('title').optional().isString().withMessage('Title must be a string').trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().isString().withMessage('Description must be a string').trim().notEmpty().withMessage('Description cannot be empty'),
    body('category').optional().isString().withMessage('Category must be a string').trim().notEmpty().withMessage('Category cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('published').optional().isBoolean().withMessage('Published must be a boolean value'),
    validateRequest, auth, teacherAuth, teacherValidator('id'), modifyCourse);

module.exports = router;