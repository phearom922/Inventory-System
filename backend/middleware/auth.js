const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  const Branch = require('../models/Branch');

  const auth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Received token:', token);
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      const user = await User.findById(decoded.userId).populate('branchId');
      if (!user) return res.status(401).json({ message: 'Invalid token' });
      req.user = user;
      req.branchIds = decoded.branchIds || (user.branchId && user.branchId.length > 0 ? user.branchId.map(b => b._id.toString()) : []);
      next();
    } catch (error) {
      console.error('Token verification error:', error);
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

  const restrictToBranch = (allowedRoutes = ['/transfer', '/product-management', '/warehouse-management', '/admin', '/branch-management', '/api/products', '/api/lots', '/api/branches']) => {
    return async (req, res, next) => {
      const user = req.user;
      const route = req.path;

      console.log('Route:', route, 'BranchIds:', req.branchIds);

      if (user.role === 'user' && allowedRoutes.includes(route)) {
        return res.status(403).json({ message: 'Forbidden: Access restricted to Admin' });
      }

      if (!req.branchIds || req.branchIds.length === 0) {
        return res.status(400).json({ message: 'No branch assigned. Contact admin to assign a branch.' });
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