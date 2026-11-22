const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Wrap async handlers so errors reach the error middleware
exports.wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'Please log in first' });
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User no longer exists' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access only' });
  next();
};
