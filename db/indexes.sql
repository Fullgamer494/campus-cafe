CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_products_name_lower ON products (LOWER(name));
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON orders (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments (order_id);
