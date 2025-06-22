const express = require('express');
const router = express.Router();
const { auth, restrictTo, restrictToBranch } = require('../middleware/auth');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// เปลี่ยนเส้นทางให้ตรงกับ base path ที่กำหนดใน server.js
router.get('/', auth, restrictTo('admin'), restrictToBranch(), getProducts);
router.post('/', auth, restrictTo('admin'), restrictToBranch(), createProduct);
router.put('/:id', auth, restrictTo('admin'), restrictToBranch(), updateProduct);
router.delete('/:id', auth, restrictTo('admin'), restrictToBranch(), deleteProduct);

module.exports = router;
