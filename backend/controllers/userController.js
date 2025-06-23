// backend/controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { username, password, role, branchId } = req.body; // ใช้ branchId ตามโค้ดเก่า
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    if (!branchId || !Array.isArray(branchId) || branchId.length === 0) {
      return res.status(400).json({ message: 'Branch ID is required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role, branchId });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('[UserController] Login attempt with username:', username);

    const user = await User.findOne({ username }).populate('branchId'); // ใช้ branchId ตามโค้ดเก่า
    if (!user) {
      console.log('[UserController] User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('[UserController] Password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const branchIds = user.branchId.map(branch => branch._id.toString());
    if (branchIds.length === 0) {
      console.log('[UserController] No branch assigned');
      return res.status(400).json({ message: 'No branch assigned to user' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, branchIds },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('[UserController] Login successful, token generated:', { userId: user._id, branchIds });

    res.json({ token });
  } catch (error) {
    console.error('[UserController] Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const users = await User.find().select('-password').populate('branchId');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { username, password, role, branchId } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.username = username || user.username;
    user.role = role || user.role;
    user.branchId = branchId || user.branchId;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUsers, updateUser, deleteUser };