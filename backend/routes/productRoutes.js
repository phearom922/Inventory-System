// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { auth, restrictTo, restrictToBranch } = require('../middleware/auth');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

router.get('/products', auth, restrictTo('admin'), restrictToBranch(), getProducts);
router.post('/products', auth, restrictTo('admin'), restrictToBranch(), createProduct);
router.put('/products/:id', auth, restrictTo('admin'), restrictToBranch(), updateProduct);
router.delete('/products/:id', auth, restrictTo('admin'), restrictToBranch(), deleteProduct);

module.exports = router;