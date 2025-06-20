const Lot = require('../models/Lot');
const Transaction = require('../models/Transaction');

const receiveLot = async (req, res) => {
  try {
    const { lotId, productId, quantity, manufactureDate, expiryDate, warehouseId, branchId } = req.body;
    const lot = new Lot({ lotId, productId, quantity, manufactureDate, expiryDate, warehouseId, branchId });
    await lot.save();
    const transaction = new Transaction({
      type: 'receive',
      lotId: lot._id,
      quantity,
      userId: req.user.id,
      warehouseId
    });
    await transaction.save();
    res.status(201).json(lot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const issueLot = async (req, res) => {
  try {
    const { lotId, quantity, warehouseId } = req.body;
    const lot = await Lot.findById(lotId);
    if (!lot || lot.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    lot.quantity -= quantity;
    await lot.save();
    const transaction = new Transaction({
      type: 'issue',
      lotId,
      quantity,
      userId: req.user.id,
      warehouseId
    });
    await transaction.save();
    res.json(lot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { receiveLot, issueLot };