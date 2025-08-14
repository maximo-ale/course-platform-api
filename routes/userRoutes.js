const express = require('express');
const router = express.Router();
const {enroll, showEnrolled, showCreated, leave} = require('../controllers/userController');
const {auth, teacherAuth} = require('../middlewares/authMiddleware');

const { param } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');

router.post('/enroll/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    validateRequest, auth, enroll);
router.get('/courses', auth, showEnrolled);
router.get('/created', auth, teacherAuth, showCreated);
router.delete('/leave/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    validateRequest, auth, leave);

module.exports = router;