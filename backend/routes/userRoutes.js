const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const { auth, restrictTo } = require('../middleware/auth');

router.post('/register', auth, restrictTo(['admin']), registerUser);
router.post('/login', loginUser);

module.exports = router;