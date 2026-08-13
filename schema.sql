-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

-- Enums
CREATE TYPE role_type AS ENUM ('ADMIN', 'STAFF');
CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
CREATE TYPE payment_method AS ENUM ('COD', 'CARD', 'JAZZCASH', 'EASYPAISA');

-- Admin users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role role_type NOT NULL DEFAULT 'ADMIN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price INT NOT NULL,
  compare_at_price INT,
  sku TEXT UNIQUE,
  stock INT NOT NULL DEFAULT 0,
  is_ready_to_ship BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  category_id UUID NOT NULL REFERENCES categories(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured);

-- Product images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INT NOT NULL DEFAULT 0
);
CREATE INDEX idx_product_images_product ON product_images(product_id);

-- Product variants (color swatches etc.)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  swatch_hex TEXT,
  price_delta INT NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0
);
CREATE INDEX idx_product_variants_product ON product_variants(product_id);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  notes TEXT,
  payment_method payment_method NOT NULL DEFAULT 'COD',
  status order_status NOT NULL DEFAULT 'PENDING',
  subtotal INT NOT NULL,
  delivery_fee INT NOT NULL DEFAULT 0,
  total INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_label TEXT,
  quantity INT NOT NULL,
  unit_price INT NOT NULL
);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


  CREATE TABLE site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  announcement_enabled BOOLEAN NOT NULL DEFAULT true,
  announcement_text TEXT NOT NULL DEFAULT 'Independence Day SALE! Enjoy FLAT 14% OFF!',
  marquee_enabled BOOLEAN NOT NULL DEFAULT true,
  marquee_items TEXT[] NOT NULL DEFAULT ARRAY[
    '🪑 Free Delivery on Orders Above Rs. 50,000',
    '🎉 Flat 10% Off This Month',
    '📞 Custom Furniture on Order'
  ],
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;


CREATE TABLE hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image TEXT NOT NULL,
  badge TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  primary_btn_text TEXT NOT NULL DEFAULT 'Explore Collection',
  primary_btn_link TEXT NOT NULL DEFAULT '/products',
  secondary_btn_text TEXT,
  secondary_btn_link TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO hero_slides (image, badge, title, subtitle, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link, sort_order) VALUES ('https://images.unsplash.com/photo-1618221710640-c0eaaa2adb49?auto=format&fit=crop&w=2000&q=85', 'Independence Sale - Flat 14% OFF', 'Luxury Interior and Crafted Furniture', 'Designed for modern homes, timeless comfort, and lifetime durability.', 'Explore Collection', '/products', 'WhatsApp Us', 'https://wa.me/923303111222', 0);
INSERT INTO hero_slides (image, badge, title, subtitle, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link, sort_order) VALUES ('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=85', 'New Arrival 2026', 'Ergonomic Office and Executive Spaces', 'Transform your workspace with high-end workstations and executive chairs.', 'Shop Office', '/products', 'View Catalog', '/catalog', 1);
INSERT INTO hero_slides (image, badge, title, subtitle, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link, sort_order) VALUES ('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85', 'Master Bedroom Collection', 'Premium Beds and Custom Wardrobes', 'Complete bedroom sets curated for elegance and smart storage solutions.', 'Discover Bedrooms', '/products', 'Custom Order', '/custom-order', 2);

ALTER TABLE categories ADD COLUMN nav_featured BOOLEAN NOT NULL DEFAULT false;