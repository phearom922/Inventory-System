const Waste = require('../models/Waste');
const Lot = require('../models/Lot');

const recordWaste = async (req, res) => {
  try {
    const { lotId, quantity, reason } = req.body;

    // ตรวจสอบล็อต
    const lot = await Lot.findById(lotId);
    if (!lot) {
      return res.status(404).json({ message: 'Lot not found' });
    }
    if (lot.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock for waste' });
    }

    // อัปเดตจำนวนสต๊อกในล็อต
    lot.quantity -= quantity;
    await lot.save();

    // บันทึกของเสีย
    const waste = new Waste({
      lotId,
      quantity,
      reason,
      recordedBy: req.user.id
    });
    await waste.save();

    res.status(201).json(waste);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getWasteRecords = async (req, res) => {
  try {
    let wasteRecords;
    if (req.user.role === 'admin') {
      // แอดมินเห็นทุกบันทึกของเสีย
      wasteRecords = await Waste.find().populate({
        path: 'lotId',
        populate: { path: 'productId' }
      }).populate('recordedBy');
    } else {
      // ผู้ใช้ทั่วไปเห็นเฉพาะบันทึกในสาขาของตัวเอง
      wasteRecords = await Waste.find().populate({
        path: 'lotId',
        match: { branchId: req.user.branchId },
        populate: { path: 'productId' }
      }).populate('recordedBy');
      wasteRecords = wasteRecords.filter(record => record.lotId); // กรองเฉพาะที่มี lotId
    }
    res.json(wasteRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { recordWaste, getWasteRecords };