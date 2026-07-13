const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken, isAdmin);

router.get('/inventory', adminController.getInventory);
router.put('/inventory/:id', adminController.updateInventory);
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

router.post('/trigger-low-stock-check', verifyToken, isAdmin, adminController.triggerLowStockCheck);

module.exports = router;
