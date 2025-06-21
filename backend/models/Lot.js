const mongoose = require('mongoose');

const lotSchema = new mongoose.Schema({
  lotId: { type: String, required: true, unique: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  quantity: { type: Number, required: true },
  manufactureDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Lot', lotSchema);