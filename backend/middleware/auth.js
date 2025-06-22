// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware
 */
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate('branchId');
    if (!user) return res.status(401).json({ message: 'Invalid token' });

    const branchIds = (decoded.branchIds && decoded.branchIds.length
      ? decoded.branchIds
      : (user.branchId || []).map(b => b?._id.toString())
    ).filter(Boolean);

    if (!branchIds.length) {
      return res.status(400).json({ message: 'No valid branch assigned' });
    }

    req.user = user;
    req.branchIds = branchIds;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

const restrictToBranch = () => (req, res, next) => {
  req.branchFilter = req.user.role === 'admin' ? req.branchIds : [req.branchIds[0]];
  next();
};

module.exports = { auth, restrictTo, restrictToBranch };