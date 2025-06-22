// backend\routes\warehouseRoutes.js
const express = require('express');
const router = express.Router();
const { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } = require('../controllers/warehouseController');
const { auth, restrictTo } = require('../middleware/auth');

router.get('/', auth, getWarehouses);
router.post('/', auth, restrictTo(['admin']), createWarehouse);
router.put('/:id', auth, restrictTo(['admin']), updateWarehouse);
router.delete('/:id', auth, restrictTo(['admin']), deleteWarehouse);

module.exports = router;