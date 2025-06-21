const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  const Branch = require('../models/Branch');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate('branchId');
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    req.branchIds = decoded.branchIds || [];
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

  const restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    };
  };

  const restrictToBranch = (allowedRoutes = ['/transfer', '/product-management', '/warehouse-management', '/admin', '/branch-management']) => {
    return async (req, res, next) => {
      const user = req.user;
      const route = req.path;

      if (user.role === 'user' && allowedRoutes.includes(route)) {
        return res.status(403).json({ message: 'Forbidden: Access restricted to Admin' });
      }

      if (!req.branchIds || req.branchIds.length === 0) {
        return res.status(400).json({ message: 'No branch assigned' });
      }

      if (user.role === 'user' && req.branchIds.length === 1) {
        req.branchFilter = [req.branchIds[0]];
      } else if (user.role === 'admin' && req.branchIds.length > 0) {
        req.branchFilter = req.branchIds;
      } else {
        return res.status(400).json({ message: 'Invalid branch configuration' });
      }

      next();
    };
  };

  module.exports = { auth, restrictTo, restrictToBranch };