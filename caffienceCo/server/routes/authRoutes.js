const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const userAuthController = require('../controllers/userAuthController');
const { adminAuth, userAuth } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'Too many attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/user/register', authLimiter, userAuthController.register);
router.post('/user/signin', authLimiter, userAuthController.signin);
router.post('/user/signout', userAuth, csrfProtection, userAuthController.signout);
router.get('/user/me', userAuth, userAuthController.me);
router.patch('/user/profile', userAuth, csrfProtection, userAuthController.updateProfile);

router.post('/admin/login', authLimiter, authController.login);
router.post('/admin/logout', adminAuth, csrfProtection, authController.logout);
router.get('/admin/me', adminAuth, authController.me);

module.exports = router;