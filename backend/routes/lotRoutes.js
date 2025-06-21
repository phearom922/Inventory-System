// backend/routes/lotRoutes.js
const express = require('express');
const router = express.Router();
const { getLots, receiveLot, issueLot } = require('../controllers/lotController');
const { auth, restrictTo, restrictToBranch } = require('../middleware/auth');

router.get('/lots', auth, restrictTo('admin'), restrictToBranch(), getLots);
router.post('/receive', auth, restrictTo('admin'), restrictToBranch(), receiveLot);
router.post('/issue', auth, restrictTo('admin'), restrictToBranch(), issueLot);

module.exports = router;