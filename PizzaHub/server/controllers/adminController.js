const pool = require('../config/db');

// @route   GET /api/admin/inventory
// @desc    Get all inventory items
// @access  Private/Admin
exports.getInventory = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM inventory ORDER BY item_type, name'
    );
    res.json(rows);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/admin/inventory/:id
// @desc    Update stock quantity for an inventory item
// @access  Private/Admin
exports.updateInventory = async (req, res) => {
  const { id } = req.params;
  const { stockQuantity } = req.body;

  if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
    return res.status(400).json({ message: 'stockQuantity must be a non-negative integer' });
  }

  try {
    const { rows } = await pool.query(
      'UPDATE inventory SET stock_quantity = $1 WHERE id = $2 RETURNING *',
      [stockQuantity, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/admin/orders
// @desc    Get all paid orders with user and items info
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const query = `
      SELECT 
        o.id, 
        o.total_price, 
        o.status, 
        o.payment_id,
        o.created_at,
        u.name AS user_name,
        u.email AS user_email,
        b.name AS base_name,
        s.name AS sauce_name,
        c.name AS cheese_name,
        COALESCE(
          (SELECT array_agg(v.name) 
           FROM order_vegetables ov 
           JOIN inventory v ON ov.vegetable_id = v.id 
           WHERE ov.order_id = o.id), 
          '{}'
        ) AS vegetables
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN inventory b ON o.base_id = b.id
      JOIN inventory s ON o.sauce_id = s.id
      JOIN inventory c ON o.cheese_id = c.id
      WHERE o.payment_id IS NOT NULL
      ORDER BY o.created_at DESC
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Order Received', 'In Kitchen', 'Sent to Delivery'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const { rows } = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const { checkLowStock } = require('../config/cron');

exports.triggerLowStockCheck = async (req, res) => {
  await checkLowStock();
  res.json({ message: 'Low stock check completed' });
};
