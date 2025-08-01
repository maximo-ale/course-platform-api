const express = require('express');
const router = express.Router();
const {register, login, showUsers, deleteUsers, deleteUser} = require('../controllers/authController');
const {auth, teacherAuth, onlyAdmin} = require('../middlewares/authMiddleware');
const idValidator = require('../middlewares/idValidator');

router.get('/showUsers', auth, onlyAdmin, showUsers);
router.post('/register', register);
router.post('/login', login);
router.delete('/delete/:id', auth, idValidator(['id']), onlyAdmin, deleteUser);
router.delete('/deleteAll', auth, onlyAdmin, deleteUsers);

module.exports = router;