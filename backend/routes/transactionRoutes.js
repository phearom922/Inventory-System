const express = require('express');
const router = express.Router();
const { transferStock, getTransactions } = require('../controllers/transactionController');
const { auth, restrictTo } = require('../middleware/auth');

router.post('/transfer', auth, restrictTo(['admin']), transferStock);
router.get('/', auth, getTransactions);

module.exports = router;