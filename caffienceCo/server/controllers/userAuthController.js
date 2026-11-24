const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { setCsrfCookie } = require('../middleware/csrf');
const { cookieOptions } = require('../utils/cookies');

const sanitizeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  contactNumber: user.contactNumber,
  deliveryAddress: user.deliveryAddress,
  city: user.city,
  postalCode: user.postalCode,
});

exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password, contactNumber } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hash,
      contactNumber: contactNumber?.trim() || '',
    });

    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.cookie('user_token', token, cookieOptions());
    const csrfToken = setCsrfCookie(res);

    res.status(201).json({ user: sanitizeUser(user), csrfToken });
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.cookie('user_token', token, cookieOptions());
    const csrfToken = setCsrfCookie(res);

    res.json({ user: sanitizeUser(user), csrfToken });
  } catch (err) {
    next(err);
  }
};

exports.signout = (req, res) => {
  res.clearCookie('user_token', cookieOptions());
  res.json({ message: 'Signed out' });
};

exports.me = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = [
      'fullName',
      'contactNumber',
      'deliveryAddress',
      'city',
      'postalCode',
    ];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] != null) updates[key] = String(req.body[key]).trim();
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
};