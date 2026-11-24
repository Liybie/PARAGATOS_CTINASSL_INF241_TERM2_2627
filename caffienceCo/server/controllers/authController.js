const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { setCsrfCookie } = require('../middleware/csrf');
const { cookieOptions } = require('../utils/cookies');
const { writeLog } = require('../utils/activityLog');

exports.login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const identifier = (username || email || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const lowered = identifier.toLowerCase();
    const admin = await Admin.findOne({
      $or: [{ username: identifier }, { email: lowered }],
    });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.cookie('admin_token', token, cookieOptions());
    const csrfToken = setCsrfCookie(res);

    req.admin = admin;
    await writeLog(req, {
      action: 'LOGIN',
      entity: 'Admin',
      entityId: admin._id,
      summary: `Admin signed in (${admin.username})`,
    });

    res.json({
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
      csrfToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res) => {
  await writeLog(req, {
    action: 'LOGOUT',
    entity: 'Admin',
    entityId: req.admin?._id,
    summary: `Admin signed out (${req.admin?.username || 'unknown'})`,
  });
  res.clearCookie('admin_token', cookieOptions());
  res.json({ message: 'Logged out' });
};

exports.me = async (req, res, next) => {
  try {
    res.json({
      admin: {
        id: req.admin._id,
        username: req.admin.username,
        email: req.admin.email,
      },
    });
  } catch (err) {
    next(err);
  }
};