const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/simulate', verifyToken, paymentController.simulatePayment);

module.exports = router;
