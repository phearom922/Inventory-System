const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['receive', 'issue', 'transfer'], required: true },
  lotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lot', required: true },
  quantity: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  destinationWarehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);