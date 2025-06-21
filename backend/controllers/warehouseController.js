const Warehouse = require('../models/Warehouse');

const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createWarehouse = async (req, res) => {
  try {
    const { warehouseId, name, address, manager, branchId } = req.body; // อัปเดตเพื่อรองรับฟิลด์ใหม่
    const existingWarehouse = await Warehouse.findOne({ warehouseId });
    if (existingWarehouse) {
      return res.status(400).json({ message: 'Warehouse ID already exists' });
    }
    const warehouse = new Warehouse({ warehouseId, name, address, manager, branchId });
    await warehouse.save();
    res.status(201).json(warehouse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateWarehouse = async (req, res) => {
  try {
    const { warehouseId, name, address, manager, branchId } = req.body; // อัปเดตเพื่อรองรับฟิลด์ใหม่
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    warehouse.warehouseId = warehouseId || warehouse.warehouseId;
    warehouse.name = name || warehouse.name;
    warehouse.address = address || warehouse.address;
    warehouse.manager = manager || warehouse.manager;
    warehouse.branchId = branchId || warehouse.branchId;
    await warehouse.save();
    res.json(warehouse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    await Warehouse.deleteOne({ _id: req.params.id });
    res.json({ message: 'Warehouse deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse };