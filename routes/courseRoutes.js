const express = require('express');
const router = express.Router();
const {getCoursesForUsers, getCourses, getCourse, createCourse, deleteCourse, modifyCourse, deleteStudent} = require('../controllers/courseController');
const {auth, onlyAdmin, teacherAuth} = require('../middlewares/authMiddleware');
const idValidator = require('../middlewares/idValidator');
const teacherValidator = require('../middlewares/teacherValidator');

router.get('/get', auth, getCoursesForUsers);
router.get('/getAll', auth, onlyAdmin, getCourses);
router.get('/get/:id', auth, idValidator(['id']), getCourse);
router.post('/create', auth, teacherAuth, createCourse);
router.delete('/delete/:id', auth, idValidator(['id']), teacherAuth, teacherValidator('id'), deleteCourse);
router.delete('/delete/:courseId/student/:userId', auth, idValidator(['courseId', 'userId']), teacherAuth, teacherValidator('courseId'), deleteStudent);
router.patch('/modify/:id', auth, idValidator(['id']), teacherAuth, teacherValidator('id'), modifyCourse);

module.exports = router;