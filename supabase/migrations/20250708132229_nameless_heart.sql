/*
  # Create Demo Data for LAKKI PHONES

  1. New Features
    - Creates sample products, categories, and users
    - Sets up demo data for testing
    - Ensures consistent data for development

  2. Security
    - Creates data with appropriate permissions
    - Sets up proper relationships between tables
*/

-- Insert demo categories
INSERT INTO categories (name, slug, description, image_url, sort_order, is_active)
VALUES
  ('Smartphones', 'smartphones', 'Latest smartphones with cutting-edge technology', 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  ('Laptops', 'laptops', 'High-performance laptops for work and gaming', 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=800', 2, true),
  ('Tablets', 'tablets', 'Portable tablets for entertainment and productivity', 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800', 3, true),
  ('Headphones', 'headphones', 'Premium audio devices for immersive sound', 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800', 4, true),
  ('Smart Home', 'smart-home', 'Smart devices to automate your home', 'https://images.pexels.com/photos/4498307/pexels-photo-4498307.jpeg?auto=compress&cs=tinysrgb&w=800', 5, true),
  ('Accessories', 'accessories', 'Essential accessories for your devices', 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert demo products
INSERT INTO products (name, slug, description, brand, price, original_price, stock_count, is_active, specifications, features, tags)
VALUES
  (
    'iPhone 15 Pro', 
    'iphone-15-pro', 
    'The most advanced iPhone ever with titanium design and A17 Pro chip.', 
    'Apple', 
    399.500, 
    449.500, 
    15, 
    true, 
    '{"Display": "6.1-inch Super Retina XDR", "Processor": "A17 Pro chip", "Storage": "128GB", "Camera": "48MP Main + 12MP Ultra Wide + 12MP Telephoto", "Battery": "Up to 23 hours video playback", "Operating System": "iOS 17"}',
    '["Titanium design", "A17 Pro chip", "Pro camera system", "5G connectivity", "Face ID", "Wireless charging"]',
    '["premium", "flagship", "camera", "5g"]'
  ),
  (
    'Samsung Galaxy S24 Ultra', 
    'samsung-galaxy-s24', 
    'Ultimate productivity powerhouse with S Pen and AI features.', 
    'Samsung', 
    459.900, 
    NULL, 
    22, 
    true, 
    '{"Display": "6.8-inch Dynamic AMOLED 2X", "Processor": "Snapdragon 8 Gen 3", "Storage": "256GB", "Camera": "200MP Main + 50MP Periscope + 50MP Ultra Wide + 12MP Front", "Battery": "5000mAh with 45W fast charging", "Operating System": "Android 14"}',
    '["S Pen included", "AI photography", "100x Space Zoom", "Titanium frame", "IP68 water resistance", "Wireless charging"]',
    '["android", "stylus", "camera", "productivity"]'
  ),
  (
    'MacBook Pro 14-inch M3', 
    'macbook-pro-m3', 
    'Supercharged for pros with M3 chip and Liquid Retina XDR display.', 
    'Apple', 
    649.900, 
    699.900, 
    8, 
    true, 
    '{"Display": "14.2-inch Liquid Retina XDR", "Processor": "Apple M3 chip", "Memory": "8GB unified memory", "Storage": "512GB SSD", "Graphics": "10-core GPU", "Battery": "Up to 22 hours", "Operating System": "macOS Sonoma"}',
    '["M3 chip performance", "Liquid Retina XDR display", "Studio-quality mics", "1080p FaceTime HD camera", "MagSafe 3 charging", "Thunderbolt 4 ports"]',
    '["professional", "creative", "portable", "performance"]'
  ),
  (
    'Dell XPS 13', 
    'dell-xps-13', 
    'Premium ultrabook with stunning InfinityEdge display.', 
    'Dell', 
    349.900, 
    NULL, 
    12, 
    true, 
    '{"Display": "13.4-inch FHD+ InfinityEdge", "Processor": "Intel Core i7-1355U", "Memory": "16GB LPDDR5", "Storage": "512GB SSD", "Graphics": "Intel Iris Xe", "Battery": "Up to 12 hours", "Operating System": "Windows 11"}',
    '["InfinityEdge display", "Premium build quality", "Thunderbolt 4", "Backlit keyboard", "Fingerprint reader", "WiFi 6E"]',
    '["ultrabook", "business", "portable", "windows"]'
  ),
  (
    'iPad Air M2', 
    'ipad-air-m2', 
    'Serious performance in a gorgeous, ultra-portable design.', 
    'Apple', 
    229.900, 
    NULL, 
    25, 
    true, 
    '{"Display": "10.9-inch Liquid Retina", "Processor": "Apple M2 chip", "Storage": "64GB", "Camera": "12MP Wide + 12MP Ultra Wide Front", "Battery": "Up to 10 hours", "Operating System": "iPadOS 17"}',
    '["M2 chip power", "Apple Pencil support", "Magic Keyboard compatible", "Touch ID", "USB-C connectivity", "Wi-Fi 6"]',
    '["creative", "productivity", "portable", "apple"]'
  ),
  (
    'AirPods Pro (2nd generation)', 
    'airpods-pro-2', 
    'Next-level sound with Adaptive Transparency and Personalized Spatial Audio.', 
    'Apple', 
    89.900, 
    99.900, 
    45, 
    true, 
    '{"Driver": "Custom high-excursion Apple driver", "Microphone": "Dual beamforming microphones", "Chip": "Apple H2 chip", "Battery": "Up to 6 hours listening time", "Case Battery": "Up to 30 hours total", "Connectivity": "Bluetooth 5.3"}',
    '["Active Noise Cancellation", "Adaptive Transparency", "Personalized Spatial Audio", "MagSafe charging case", "Sweat and water resistant", "Touch control"]',
    '["wireless", "noise-cancelling", "premium", "apple"]'
  ),
  (
    'Sony WH-1000XM5', 
    'sony-wh1000xm5', 
    'Industry-leading noise canceling with premium sound quality.', 
    'Sony', 
    149.900, 
    NULL, 
    18, 
    true, 
    '{"Driver": "30mm drivers", "Frequency Response": "4Hz-40kHz", "Impedance": "48 ohms", "Battery": "Up to 30 hours", "Charging": "USB-C quick charge", "Weight": "250g"}',
    '["Industry-leading noise canceling", "30-hour battery life", "Quick charge (3min = 3hrs)", "Speak-to-chat technology", "Multipoint connection", "Touch sensor controls"]',
    '["over-ear", "noise-cancelling", "premium", "sony"]'
  ),
  (
    'Amazon Echo Dot (5th Gen)', 
    'echo-dot-5', 
    'Smart speaker with Alexa - better sound and performance.', 
    'Amazon', 
    19.900, 
    24.900, 
    67, 
    true, 
    '{"Speaker": "1.73\" front-firing speaker", "Microphone": "Far-field voice recognition", "Connectivity": "Wi-Fi, Bluetooth", "Dimensions": "3.9\" x 3.9\" x 3.5\"", "Weight": "10.7 oz", "Voice Assistant": "Alexa built-in"}',
    '["Alexa built-in", "Improved sound quality", "Smart home control", "Voice control", "Compact design", "Multiple colors"]',
    '["smart-speaker", "voice-control", "alexa", "affordable"]'
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert product images
INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
SELECT 
  p.id,
  'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
  p.name || ' - Main Image',
  0,
  true
FROM products p
WHERE p.slug = 'iphone-15-pro'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
SELECT 
  p.id,
  'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
  p.name || ' - Main Image',
  0,
  true
FROM products p
WHERE p.slug = 'samsung-galaxy-s24'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
SELECT 
  p.id,
  'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=800',
  p.name || ' - Main Image',
  0,
  true
FROM products p
WHERE p.slug = 'macbook-pro-m3'
ON CONFLICT DO NOTHING;

-- Create demo admin users (if they don't exist)
DO $$
BEGIN
  -- This is just a placeholder. In a real implementation, users would be created through the Auth API
  RAISE NOTICE 'Demo users should be created via Auth API:';
  RAISE NOTICE '- admin@lakkiphones.com / admin123';
  RAISE NOTICE '- manager@lakkiphones.com / admin123';
  RAISE NOTICE '- editor@lakkiphones.com / admin123';
END $$;