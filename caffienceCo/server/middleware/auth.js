const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.admin_token;
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Invalid session' });
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
};

const userAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.user_token;
    if (!token) {
      return res.status(401).json({ message: 'Sign in required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'user') {
      return res.status(401).json({ message: 'Invalid session' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
};

const optionalUserAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.user_token;
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'user') {
      const user = await User.findById(decoded.id).select('-password');
      if (user) req.user = user;
    }
    next();
  } catch {
    next();
  }
};

module.exports = adminAuthMiddleware;
module.exports.adminAuth = adminAuthMiddleware;
module.exports.userAuth = userAuthMiddleware;
module.exports.optionalUser = optionalUserAuth;