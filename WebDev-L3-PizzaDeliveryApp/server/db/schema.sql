-- db/schema.sql

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    is_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('base', 'sauce', 'cheese', 'vegetable')),
    name VARCHAR(255) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    threshold INT NOT NULL DEFAULT 10
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'unique_inventory_item'
    ) THEN
        ALTER TABLE inventory ADD CONSTRAINT unique_inventory_item UNIQUE (item_type, name);
    END IF;
END $$;

-- Seed initial inventory data
INSERT INTO inventory (item_type, name, stock_quantity) VALUES
('base', 'Thin Crust', 100),
('base', 'Thick Crust', 100),
('sauce', 'Tomato', 100),
('sauce', 'BBQ', 100),
('cheese', 'Mozzarella', 100),
('cheese', 'Cheddar', 100),
('vegetable', 'Onion', 100),
('vegetable', 'Capsicum', 100)
ON CONFLICT (item_type, name) DO NOTHING;

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    base_id INT NOT NULL REFERENCES inventory(id),
    sauce_id INT NOT NULL REFERENCES inventory(id),
    cheese_id INT NOT NULL REFERENCES inventory(id),
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Order Received',
    payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_vegetables (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    vegetable_id INT NOT NULL REFERENCES inventory(id)
);

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_vegetables_order_id ON order_vegetables(order_id);
