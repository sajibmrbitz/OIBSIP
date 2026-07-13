const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware');

// Apply verifyToken middleware to all routes in this file
router.use(verifyToken);

router.get('/options', orderController.getOptions);
router.post('/create', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

module.exports = router;
