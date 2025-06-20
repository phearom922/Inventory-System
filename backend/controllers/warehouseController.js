const Warehouse = require('../models/Warehouse');

const createWarehouse = async (req, res) => {
  try {
    const { warehouseId, name, address, manager, branchId } = req.body;
    
    // ตรวจสอบว่า warehouseId มีอยู่แล้วหรือไม่
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

const getWarehouses = async (req, res) => {
  try {
    let warehouses;
    if (req.user.role === 'admin') {
      // แอดมินเห็นทุกคลัง
      warehouses = await Warehouse.find();
    } else {
      // ผู้ใช้ทั่วไปเห็นเฉพาะคลังในสาขาของตัวเอง
      warehouses = await Warehouse.find({ branchId: req.user.branchId });
    }
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createWarehouse, getWarehouses };