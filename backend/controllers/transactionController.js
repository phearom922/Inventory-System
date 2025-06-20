const Transaction = require('../models/Transaction');
const Lot = require('../models/Lot');

const transferStock = async (req, res) => {
  try {
    const { lotId, quantity, fromWarehouseId, toWarehouseId } = req.body;
    const lot = await Lot.findById(lotId);
    if (!lot || lot.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    lot.quantity -= quantity;
    await lot.save();
    const newLot = new Lot({
      lotId: `LOT-${Date.now()}`,
      productId: lot.productId,
      quantity,
      manufactureDate: lot.manufactureDate,
      expiryDate: lot.expiryDate,
      warehouseId: toWarehouseId,
      branchId: (await Warehouse.findById(toWarehouseId)).branchId
    });
    await newLot.save();
    const transaction = new Transaction({
      type: 'transfer',
      lotId,
      quantity,
      userId: req.user.id,
      warehouseId: fromWarehouseId,
      destinationWarehouseId: toWarehouseId
    });
    await transaction.save();
    res.json({ message: 'Stock transferred' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('lotId').populate('userId').populate('warehouseId');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { transferStock, getTransactions };