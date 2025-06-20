const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  warehouseId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  manager: { type: String, required: true },
  branchId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Warehouse', warehouseSchema);