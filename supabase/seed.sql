-- Seed Data for Supabase

-- 1. Categories
INSERT INTO public.categories (name, slug, image_url, description) VALUES
('Electronics', 'electronics', 'https://picsum.photos/400/400?random=101', 'Gadgets and devices'),
('Fashion', 'fashion', 'https://picsum.photos/400/400?random=102', 'Clothing and apparel'),
('Home & Living', 'home-living', 'https://picsum.photos/400/400?random=103', 'Furniture and decor'),
('Beauty', 'beauty', 'https://picsum.photos/400/400?random=104', 'Skincare and makeup'),
('Accessories', 'accessories', 'https://picsum.photos/400/400?random=106', 'Watches, bags, and jewelry');

-- 2. Products
-- Using subquery to link category by name
INSERT INTO public.products (title, slug, price, original_price, description, category_id, main_image_url, rating_rate, rating_count, stock, is_active)
VALUES
(
  'Premium Wireless Headphones', 
  'premium-wireless-headphones', 
  249.99, 
  299.99, 
  'Immerse yourself in high-fidelity audio with our premium noise-canceling headphones. Features 30-hour battery life and plush ear cushions.',
  (SELECT id FROM public.categories WHERE name = 'Electronics' LIMIT 1),
  'https://picsum.photos/400/400?random=1',
  4.8,
  120,
  50,
  true
),
(
  'Ergonomic Office Chair',
  'ergonomic-office-chair',
  199.50,
  null,
  'Work in comfort with this fully adjustable ergonomic chair. Breathable mesh back and lumbar support included.',
  (SELECT id FROM public.categories WHERE name = 'Home & Living' LIMIT 1),
  'https://picsum.photos/400/400?random=2',
  4.5,
  85,
  20,
  true
),
(
  'Analog Classic Watch',
  'analog-classic-watch',
  129.00,
  159.00,
  'A timeless piece for the modern professional. Genuine leather strap and water-resistant casing.',
  (SELECT id FROM public.categories WHERE name = 'Accessories' LIMIT 1),
  'https://picsum.photos/400/400?random=3',
  4.2,
  45,
  100,
  true
),
(
  'Smart Home Hub',
  'smart-home-hub',
  89.99,
  null,
  'Control your entire home with voice commands. Compatible with all major smart devices.',
  (SELECT id FROM public.categories WHERE name = 'Electronics' LIMIT 1),
  'https://picsum.photos/400/400?random=4',
  4.6,
  210,
  30,
  true
),
(
  'Organic Cotton T-Shirt',
  'organic-cotton-t-shirt',
  29.95,
  null,
  'Sustainably sourced, soft, and durable. The perfect essential tee for any wardrobe.',
  (SELECT id FROM public.categories WHERE name = 'Fashion' LIMIT 1),
  'https://picsum.photos/400/400?random=5',
  4.3,
  300,
  200,
  true
),
(
  'Minimalist Backpack',
  'minimalist-backpack',
  65.00,
  85.00,
  'Water-resistant canvas with a dedicated laptop compartment. Ideal for commuting or travel.',
  (SELECT id FROM public.categories WHERE name = 'Accessories' LIMIT 1),
  'https://picsum.photos/400/400?random=6',
  4.7,
  150,
  75,
  true
),
(
  'Ceramic Coffee Set',
  'ceramic-coffee-set',
  45.00,
  null,
  'Handcrafted ceramic mugs and pot. Microwave and dishwasher safe.',
  (SELECT id FROM public.categories WHERE name = 'Home & Living' LIMIT 1),
  'https://picsum.photos/400/400?random=7',
  4.9,
  60,
  40,
  true
),
(
  'Mechanical Keyboard',
  'mechanical-keyboard',
  110.00,
  140.00,
  'Tactile switches for the ultimate typing experience. RGB backlighting with customizable modes.',
  (SELECT id FROM public.categories WHERE name = 'Electronics' LIMIT 1),
  'https://picsum.photos/400/400?random=8',
  4.8,
  95,
  25,
  true
);

-- 3. Menu Items
INSERT INTO public.menu_items (label, view_route, icon_name, sort_order, is_special) VALUES
('Home', 'HOME', 'Home', 0, false),
('Categories', 'SHOP', 'Grid', 1, true),
('Shop', 'SHOP', 'ShoppingCart', 2, false),
('Contact', 'CONTACT', 'Phone', 3, false);

-- 4. Settings (Home Page Config & Footer)
INSERT INTO public.settings (key, value) VALUES
('home_page_config', '{
  "sections": [
    {
      "id": "hero_1",
      "type": "hero",
      "label": "Hero Banner",
      "visible": true,
      "order": 0,
      "settings": {
        "title": "Welcome to E-Shop",
        "subtitle": "Discover amazing products",
        "cta": "Shop Now",
        "image": "https://picsum.photos/1200/600?random=hero"
      }
    },
    {
      "id": "cats_1",
      "type": "categories",
      "label": "Category Showcase",
      "visible": true,
      "order": 1,
      "settings": {
        "title": "Shop by Category",
        "maxItems": 4
      }
    },
    {
      "id": "promo_1",
      "type": "promo",
      "label": "Summer Sale",
      "visible": true,
      "order": 2,
      "settings": {
        "title": "Summer Sale",
        "subtitle": "Up to 50% off",
        "cta": "View Deals"
      }
    }
  ]
}'),
('footer_config', '{
  "bottomText": "© 2024 E-Shop. All rights reserved.",
  "blocks": [
    {
      "id": "f1",
      "type": "text",
      "title": "About Us",
      "content": "We provide high quality products for your daily needs."
    },
    {
      "id": "f2",
      "type": "links",
      "title": "Quick Links",
      "settings": {
        "links": [
          {"label": "Home", "url": "/"},
          {"label": "Shop", "url": "/shop"},
          {"label": "Contact", "url": "/contact"}
        ]
      }
    }
  ]
}');
