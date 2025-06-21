const mongoose = require('mongoose');

  const warehouseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    manager: { type: String, required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true }
  }, { timestamps: true });

  module.exports = mongoose.model('Warehouse', warehouseSchema);