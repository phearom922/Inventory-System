const Branch = require('../models/Branch');

  const getBranches = async (req, res) => {
    try {
      console.log('Fetching branches with branchFilter:', req.branchFilter); // Log เพื่อตรวจสอบ
      const branches = await Branch.find({ _id: { $in: req.branchFilter || [] } });
      res.json(branches);
    } catch (error) {
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