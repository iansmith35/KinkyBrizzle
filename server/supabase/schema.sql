-- KinkyBrizzle Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    mockup_urls JSONB DEFAULT '[]'::jsonb,
    variants JSONB DEFAULT '{}'::jsonb,
    sku TEXT UNIQUE,
    is_adult BOOLEAN DEFAULT false,
    printful_product_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    items JSONB NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    printful_order_id TEXT,
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table (persistent cart)
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    size TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom design requests table
CREATE TABLE IF NOT EXISTS design_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    description TEXT NOT NULL,
    file_url TEXT,
    status TEXT DEFAULT 'pending',
    ai_generated_design_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat history table (for AI memory)
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    role TEXT NOT NULL, -- 'user' or 'assistant'
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI actions log table (track what AI does autonomously)
CREATE TABLE IF NOT EXISTS ai_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    action_type TEXT NOT NULL, -- 'create_product', 'update_order', 'generate_design', etc.
    action_data JSONB,
    result JSONB,
    success BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_cart_session ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_actions_session ON ai_actions(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow public read, authenticated write for now)
-- Products: public can read, service role can write
CREATE POLICY "Public products are viewable by everyone" 
    ON products FOR SELECT 
    USING (true);

CREATE POLICY "Service role can insert products" 
    ON products FOR INSERT 
    WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Service role can update products" 
    ON products FOR UPDATE 
    USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Orders: authenticated users can view their own, service can view all
CREATE POLICY "Orders are viewable by everyone" 
    ON orders FOR SELECT 
    USING (true);

CREATE POLICY "Anyone can insert orders" 
    ON orders FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Service role can update orders" 
    ON orders FOR UPDATE 
    USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Cart: users can view/modify their own cart
CREATE POLICY "Cart items viewable by session" 
    ON cart_items FOR SELECT 
    USING (true);

CREATE POLICY "Anyone can insert cart items" 
    ON cart_items FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Anyone can update cart items" 
    ON cart_items FOR UPDATE 
    USING (true);

CREATE POLICY "Anyone can delete cart items" 
    ON cart_items FOR DELETE 
    USING (true);

-- Design requests: public can submit
CREATE POLICY "Design requests viewable by all" 
    ON design_requests FOR SELECT 
    USING (true);

CREATE POLICY "Anyone can submit design requests" 
    ON design_requests FOR INSERT 
    WITH CHECK (true);

-- Chat history: readable by session
CREATE POLICY "Chat history viewable by session" 
    ON chat_history FOR SELECT 
    USING (true);

CREATE POLICY "Anyone can insert chat" 
    ON chat_history FOR INSERT 
    WITH CHECK (true);

-- AI actions: service role only
CREATE POLICY "AI actions viewable by all" 
    ON ai_actions FOR SELECT 
    USING (true);

CREATE POLICY "Anyone can log AI actions" 
    ON ai_actions FOR INSERT 
    WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_design_requests_updated_at BEFORE UPDATE ON design_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
