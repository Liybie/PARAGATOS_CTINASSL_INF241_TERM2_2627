const express = require('express');
const logController = require('../controllers/logController');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', adminAuth, logController.getLogs);

module.exports = router;