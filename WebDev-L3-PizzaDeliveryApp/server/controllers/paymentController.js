const crypto = require('crypto');
const pool = require('../config/db');

// @route   POST /api/payment/order
// @desc    Create demo Razorpay order
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body; // amount in taka, e.g. 499
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // --- DEMO: fake order object ---
    const fakeOrder = {
      id: 'order_demo_' + Date.now(),
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      status: 'created',
      internalOrderId: orderId
    };

    res.json(fakeOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Order creation failed' });
  }
};

// @route   POST /api/payment/verify
// @desc    Verify payment and decrement inventory
// @access  Private
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, internalOrderId } = req.body;
  const userId = req.user.userId;

  if (!internalOrderId) {
    return res.status(400).json({ message: 'Internal Order ID is required' });
  }

  // Demo mode: real key_secret nai bole signature verify skip kortesi
  console.log('Demo payment received:', { razorpay_order_id, razorpay_payment_id });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Fetch the order
    const orderResult = await client.query(
      'SELECT * FROM orders WHERE id = $1 FOR UPDATE',
      [internalOrderId]
    );

    if (orderResult.rows.length === 0) {
      throw { status: 404, message: 'Order not found' };
    }

    const order = orderResult.rows[0];

    // Ensure it belongs to the logged-in user
    if (order.user_id !== userId) {
      throw { status: 403, message: 'Not authorized to pay for this order' };
    }

    // Check if already paid
    if (order.payment_id) {
      throw { status: 400, message: 'Order already paid' };
    }

    // Use razorpay_payment_id or generate one if not provided (fallback)
    const paymentId = razorpay_payment_id || 'MOCK_' + crypto.randomUUID();

    // Update order with payment ID
    const updatedOrderResult = await client.query(
      `UPDATE orders 
       SET payment_id = $1
       WHERE id = $2 
       RETURNING *`,
      [paymentId, internalOrderId]
    );

    const updatedOrder = updatedOrderResult.rows[0];

    // Fetch vegetables linked to this order
    const vegResult = await client.query(
      'SELECT vegetable_id FROM order_vegetables WHERE order_id = $1',
      [internalOrderId]
    );
    const vegetableIds = vegResult.rows.map(row => row.vegetable_id);

    // Decrement inventory
    const itemIds = [order.base_id, order.sauce_id, order.cheese_id, ...vegetableIds];
    const itemCounts = {};
    for (const id of itemIds) {
      itemCounts[id] = (itemCounts[id] || 0) + 1;
    }

    for (const [id, count] of Object.entries(itemCounts)) {
      await client.query(
        'UPDATE inventory SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [count, id]
      );
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Payment verified (demo mode)',
      order: updatedOrder
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Verify payment error:', error);
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    client.release();
  }
};
