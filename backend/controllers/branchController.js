// backend/controllers/branchController.js
const mongoose = require('mongoose');
const Branch = require('../models/Branch');

const getBranches = async (req, res) => {
  try {
    console.log('[BranchController] Fetching branches with branchFilter:', req.branchFilter);
    const objectIds = (req.branchFilter || []).map(id => {
      try {
        return mongoose.Types.ObjectId.createFromHexString(id); // ใช้ createFromHexString
      } catch (e) {
        console.error('[BranchController] Invalid ObjectId:', id, e);
        return null;
      }
    }).filter(id => id !== null);
    console.log('[BranchController] Converted objectIds:', objectIds);
    if (objectIds.length === 0) {
      console.warn('[BranchController] No valid objectIds, returning empty array');
      return res.json([]);
    }
    const branches = await Branch.find({ _id: { $in: objectIds } });
    console.log('[BranchController] Fetched branches:', branches);
    res.json(branches);
  } catch (error) {
    console.error('[BranchController] Fetch error:', error);
    res.status(500).json({ message: error.message });
  }
};

const createBranch = async (req, res) => {
  try {
    const branch = new Branch(req.body);
    const savedBranch = await branch.save();
    res.status(201).json(savedBranch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.json(branch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.json({ message: 'Branch deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBranches, createBranch, updateBranch, deleteBranch };