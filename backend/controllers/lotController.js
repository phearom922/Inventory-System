// backend/controllers/lotController.js
const Lot = require('../models/Lot');
const Warehouse = require('../models/Warehouse');
const mongoose = require('mongoose');

const getLots = async (req, res) => {
  try {
    const lots = await Lot.find().populate({
      path: 'warehouseId',
      populate: { path: 'branchId' }
    }).populate('productId');

    const filteredLots = lots.filter(lot => {
      const branchId = lot.warehouseId?.branchId?._id?.toString();
      return branchId && req.branchFilter.includes(branchId);
    });

    res.json(filteredLots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const receiveLot = async (req, res) => {
  try {
    const { productId, quantity, warehouseId, manufactureDate, expiryDate } = req.body;
    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse || !req.branchFilter.includes(warehouse.branchId.toString())) {
      return res.status(403).json({ message: 'Unauthorized warehouse' });
    }
    const lot = new Lot({
      lotId: `LOT-${Date.now()}`,
      productId: new mongoose.Types.ObjectId(productId),
      warehouseId: new mongoose.Types.ObjectId(warehouseId),
      quantity,
      manufactureDate,
      expiryDate
    });
    await lot.save();
    res.status(201).json(lot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const issueLot = async (req, res) => {
  try {
    const { lotId, quantity } = req.body;
    const lot = await Lot.findById(lotId).populate({
      path: 'warehouseId',
      populate: { path: 'branchId' }
    });
    if (!lot) return res.status(404).json({ message: 'Lot not found' });
    const branchId = lot.warehouseId?.branchId?._id?.toString();
    if (!branchId || !req.branchFilter.includes(branchId)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (lot.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity in lot' });
    }
    lot.quantity -= quantity;
    await lot.save();
    res.json(lot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getLots, receiveLot, issueLot };
