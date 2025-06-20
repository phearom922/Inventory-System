const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { auth, restrictTo } = require('../middleware/auth');

router.post('/register', auth, restrictTo(['admin']), registerUser);
router.post('/login', loginUser);
router.get('/', auth, restrictTo(['admin']), getUsers);
router.put('/:id', auth, restrictTo(['admin']), updateUser);
router.delete('/:id', auth, restrictTo(['admin']), deleteUser);

module.exports = router;