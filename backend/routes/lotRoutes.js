const express = require('express');
const router = express.Router();
const { receiveLot, issueLot } = require('../controllers/lotController');
const { auth, restrictTo } = require('../middleware/auth');

router.post('/receive', auth, receiveLot);
router.post('/issue', auth, issueLot);

module.exports = router;