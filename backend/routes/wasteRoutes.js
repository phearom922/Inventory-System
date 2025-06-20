const express = require('express');
const router = express.Router();
const { recordWaste, getWasteRecords } = require('../controllers/wasteController');
const { auth } = require('../middleware/auth');

router.post('/', auth, recordWaste);
router.get('/', auth, getWasteRecords);

module.exports = router;