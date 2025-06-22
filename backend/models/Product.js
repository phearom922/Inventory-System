// backend/models/Product.js
const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  category: { type: String, required: true },
  unit: { type: String, required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  minimumStock: { type: Number, required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);