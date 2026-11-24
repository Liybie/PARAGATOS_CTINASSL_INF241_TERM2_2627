const express = require('express');
const productController = require('../controllers/productController');
const { adminAuth } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');

const router = express.Router();

router.get('/admin/all', adminAuth, productController.getAllProductsAdmin);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', adminAuth, csrfProtection, productController.createProduct);
router.put('/:id', adminAuth, csrfProtection, productController.updateProduct);
router.delete('/:id', adminAuth, csrfProtection, productController.deleteProduct);

module.exports = router;