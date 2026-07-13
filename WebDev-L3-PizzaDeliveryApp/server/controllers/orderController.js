const pool = require('../config/db');

// @route   GET /api/orders/options
// @desc    Returns available bases, sauces, cheeses, vegetables
// @access  Private
exports.getOptions = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, item_type, stock_quantity FROM inventory WHERE stock_quantity > 0 AND item_type IN ('base', 'sauce', 'cheese', 'vegetable')"
    );
    
    // Group by item_type for easier frontend consumption
    const options = {
      bases: rows.filter(r => r.item_type === 'base'),
      sauces: rows.filter(r => r.item_type === 'sauce'),
      cheeses: rows.filter(r => r.item_type === 'cheese'),
      vegetables: rows.filter(r => r.item_type === 'vegetable'),
    };
    
    res.json(options);
  } catch (error) {
    console.error('Error fetching options:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   POST /api/orders/create
// @desc    Create a new order with base, sauce, cheese, and vegetables
// @access  Private
exports.createOrder = async (req, res) => {
  const { baseId, sauceId, cheeseId, vegetableIds } = req.body;
  const userId = req.user.userId;

  if (!baseId || !sauceId || !cheeseId || !Array.isArray(vegetableIds)) {
    return res.status(400).json({ message: 'Invalid order data. baseId, sauceId, cheeseId, and vegetableIds (array) are required.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Validate items and stock
    const allIds = [baseId, sauceId, cheeseId, ...vegetableIds];
    
    const { rows: items } = await client.query(
      'SELECT id, item_type, stock_quantity FROM inventory WHERE id = ANY($1)',
      [allIds]
    );

    if (items.length !== allIds.length) {
      throw { status: 400, message: 'One or more selected items are invalid or do not exist' };
    }

    for (const item of items) {
      if (item.stock_quantity <= 0) {
        throw { status: 400, message: `Item out of stock: ${item.id}` };
      }
    }

    // 2. Calculate price (placeholder prices in Taka)
    const basePrice = 150;
    const saucePrice = 30;
    const cheesePrice = 50;
    const vegPrice = 20;

    const totalPrice = basePrice + saucePrice + cheesePrice + (vegetableIds.length * vegPrice);

    // 3. Insert order
    const orderRes = await client.query(
      `INSERT INTO orders (user_id, base_id, sauce_id, cheese_id, total_price, status)
       VALUES ($1, $2, $3, $4, $5, 'Order Received') RETURNING *`,
      [userId, baseId, sauceId, cheeseId, totalPrice]
    );

    const newOrder = orderRes.rows[0];

    // 4. Insert vegetables
    if (vegetableIds.length > 0) {
      // Map to values ($1, $2), ($1, $3) ... 
      // Avoid SQL injection even if we expect ids to be integers
      let valueStrings = [];
      let queryParams = [newOrder.id];
      let counter = 2; // $1 is order_id

      for (const vId of vegetableIds) {
        valueStrings.push(`($1, $${counter})`);
        queryParams.push(vId);
        counter++;
      }

      const vegValuesQuery = valueStrings.join(', ');
      
      await client.query(
        `INSERT INTO order_vegetables (order_id, vegetable_id) VALUES ${vegValuesQuery}`,
        queryParams
      );
    }

    await client.query('COMMIT');
    
    res.status(201).json({ 
        message: 'Order created successfully', 
        order: { ...newOrder, vegetableIds } 
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    if (error.status) {
        return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// @route   GET /api/orders/my-orders
// @desc    Get user's orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const query = `
      SELECT 
        o.id, 
        o.total_price, 
        o.status, 
        o.payment_id,
        o.created_at,
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
      JOIN inventory b ON o.base_id = b.id
      JOIN inventory s ON o.sauce_id = s.id
      JOIN inventory c ON o.cheese_id = c.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `;

    const { rows } = await pool.query(query, [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching my orders:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route   GET /api/orders/:id
// @desc    Get single order by id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const query = `
      SELECT 
        o.id, 
        o.user_id,
        o.total_price, 
        o.status, 
        o.payment_id,
        o.created_at,
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
      JOIN inventory b ON o.base_id = b.id
      JOIN inventory s ON o.sauce_id = s.id
      JOIN inventory c ON o.cheese_id = c.id
      WHERE o.id = $1
    `;

    const { rows } = await pool.query(query, [orderId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = rows[0];

    if (order.user_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order by id:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
