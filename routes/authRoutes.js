const express = require('express');
const router = express.Router();
const {register, login, showUsers, deleteUser} = require('../controllers/authController');
const {auth, onlyAdmin} = require('../middlewares/authMiddleware');

const { body, param } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');

router.get('/showUsers', auth, onlyAdmin, showUsers);

router.post('/register',
    body('name').isString().withMessage('Name must be a string').bail().trim().notEmpty().withMessage('Invalid name'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    body('password').isString().withMessage('Password must be a string').bail().trim().isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    validateRequest , register);

router.post('/login',
    body('name').optional().trim().notEmpty().withMessage('Invalid name'),
    body('email').optional().isEmail().withMessage('Invalid email'),
    body('password').trim().notEmpty().withMessage('Invalid password'),
    validateRequest, login);

router.delete('/delete/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    validateRequest, auth, onlyAdmin, deleteUser);

module.exports = router;