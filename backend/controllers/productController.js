const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
    const { sku, name, category, unit, description, minimumStock } = req.body;
    const product = new Product({ sku, name, category, unit, description, minimumStock });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProduct, getProducts };