const Lot = require('../models/Lot');
const Warehouse = require('../models/Warehouse');

const getLots = async (req, res) => {
  console.log('branchFilter:', req.branchFilter, 'query:', req.query.branchId);
  try {
    const branchFilter = req.branchFilter || (req.query.branchId ? req.query.branchId : []);
    if (!Array.isArray(branchFilter)) {
      branchFilter = [branchFilter]; // แปลงเป็น array ถ้าเป็น string
    }
    if (branchFilter.length === 0) {
      return res.status(400).json({ message: 'No branch filter provided' });
    }
    const lots = await Lot.find().populate('productId warehouseId');
    const filteredLots = lots.filter(lot => {
      if (!lot.warehouseId || !lot.warehouseId.branchId) return false;
      return branchFilter.includes(lot.warehouseId.branchId.toString());
    });
    res.json(filteredLots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const receiveLot = async (req, res) => {
  try {
    const { productId, quantity, warehouseId } = req.body;
    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse || !req.branchFilter.includes(warehouse.branchId.toString())) {
      return res.status(403).json({ message: 'Unauthorized warehouse' });
    }
    const lot = new Lot({ productId, quantity, warehouseId });
    await lot.save();
    res.status(201).json(lot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const issueLot = async (req, res) => {
  try {
    const { lotId, quantity } = req.body;
    const lot = await Lot.findById(lotId).populate('warehouseId');
    if (!lot || !lot.warehouseId || !req.branchFilter.includes(lot.warehouseId.branchId.toString())) {
      return res.status(404).json({ message: 'Lot not found or unauthorized' });
    }
    lot.quantity -= quantity;
    await lot.save();
    res.json(lot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getLots, receiveLot, issueLot };