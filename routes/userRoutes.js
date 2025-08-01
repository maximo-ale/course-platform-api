const express = require('express');
const router = express.Router();
const {enroll, showEnrolled, showCreated, leave} = require('../controllers/userController');
const {auth, teacherAuth} = require('../middlewares/authMiddleware');
const idValidator = require('../middlewares/idValidator');

router.post('/enroll/:id', auth, idValidator, enroll);
router.get('/courses', auth, showEnrolled);
router.get('/created', auth, teacherAuth, showCreated);
router.delete('/leave/:id', auth, idValidator, leave);

module.exports = router;