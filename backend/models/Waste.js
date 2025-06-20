const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema({
  lotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lot', required: true },
  quantity: { type: Number, required: true },
  reason: { type: String, required: true },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Waste', wasteSchema);