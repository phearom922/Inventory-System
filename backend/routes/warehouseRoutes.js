const express = require('express');
const router = express.Router();
const { createWarehouse, getWarehouses } = require('../controllers/warehouseController');
const { auth, restrictTo } = require('../middleware/auth');

router.post('/', auth, restrictTo(['admin']), createWarehouse);
router.get('/', auth, getWarehouses);

module.exports = router;