const express = require('express');
const rateLimit = require('express-rate-limit');
const orderController = require('../controllers/orderController');
const { adminAuth, userAuth, optionalUser } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');

const router = express.Router();

const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: { message: 'Too many lookup attempts.' },
});

router.post('/', optionalUser, orderController.createOrder);
router.get('/my', userAuth, orderController.getMyOrders);
router.post('/track', trackLimiter, orderController.trackOrder);
router.get('/', adminAuth, orderController.getOrders);
router.get('/:id', adminAuth, orderController.getOrderById);
router.patch('/:id/status', adminAuth, csrfProtection, orderController.updateOrderStatus);

module.exports = router;