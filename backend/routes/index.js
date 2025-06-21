const express = require('express');
const router = express.Router();
const { auth, restrictTo, restrictToBranch } = require('../middleware/auth');
const { getUsers, createUser } = require('../controllers/userController');
const { getWarehouses, createWarehouse } = require('../controllers/warehouseController');
const { getProducts, createProduct } = require('../controllers/productController');
const { receiveLot } = receiveLotController; // สมมติว่าเป็น controller

// Routes สำหรับ Admin เท่านั้น
router.get('/admin', auth, restrictTo('admin'), restrictToBranch(), getUsers);
router.post('/admin', auth, restrictTo('admin'), restrictToBranch(), createUser);

router.get('/warehouse-management', auth, restrictTo('admin'), restrictToBranch(), getWarehouses);
router.post('/warehouse-management', auth, restrictTo('admin'), restrictToBranch(), createWarehouse);

router.get('/product-management', auth, restrictTo('admin'), restrictToBranch(), getProducts);
router.post('/product-management', auth, restrictTo('admin'), restrictToBranch(), createProduct);

router.get('/transfer', auth, restrictTo('admin'), restrictToBranch(), (req, res) => res.send('Transfer Stock'));
router.post('/receive', auth, restrictToBranch(), receiveLot); // User สามารถรับ Lot ได้ใน Branch ของตัวเอง

module.exports = router;