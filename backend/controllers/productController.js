const Product = require('../models/Product');

  const getProducts = async (req, res) => {
    console.log('branchFilter:', req.branchFilter, 'query:', req.query.branchId);
    try {
      let branchFilter = req.branchFilter || [];
      if (req.query.branchId) {
        branchFilter = Array.isArray(req.query.branchId) ? req.query.branchId : [req.query.branchId];
      }
      if (branchFilter.length === 0) {
        return res.status(400).json({ message: 'No branch filter provided' });
      }
      const products = await Product.find({ branchId: { $in: branchFilter.map(id => id.toString()) } });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const createProduct = async (req, res) => {
    try {
      const { category, unit, name, sku, minimumStock } = req.body;
      const existingProduct = await Product.findOne({ sku });
      if (existingProduct) {
        return res.status(400).json({ message: 'SKU already exists' });
      }
      const product = new Product({ category, unit, name, sku, minimumStock, branchId: req.branchFilter[0] });
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  const updateProduct = async (req, res) => {
    try {
      const { category, unit, name, sku, minimumStock } = req.body;
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      if (!req.branchFilter.includes(product.branchId.toString())) {
        return res.status(403).json({ message: 'Forbidden: Not authorized to update this product' });
      }
      product.category = category || product.category;
      product.unit = unit || product.unit;
      product.name = name || product.name;
      product.sku = sku || product.sku;
      product.minimumStock = minimumStock || product.minimumStock;
      await product.save();
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  const deleteProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      if (!req.branchFilter.includes(product.branchId.toString())) {
        return res.status(403).json({ message: 'Forbidden: Not authorized to delete this product' });
      }
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  module.exports = { getProducts, createProduct, updateProduct, deleteProduct };