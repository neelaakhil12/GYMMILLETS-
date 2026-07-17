-- =============================================
-- GymMillets Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- =============================================

-- ─────────────────────────────────────────────
-- 1. PRODUCTS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,
  price         INTEGER NOT NULL,
  quantity      TEXT NOT NULL DEFAULT '500 g',
  badge         TEXT DEFAULT '',
  description   TEXT DEFAULT '',
  image         TEXT DEFAULT '',
  rating        NUMERIC(3,1) DEFAULT 4.8,
  reviews_count INTEGER DEFAULT 0,
  variants      JSONB DEFAULT '[]',
  nutrition     JSONB DEFAULT '{"protein":"10g","fiber":"6g","carbs":"60g","fat":"1g"}',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and create policy (drop first so it is safe to re-run)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON public.products;
CREATE POLICY "Allow all" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────
-- 2. ORDERS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id               TEXT PRIMARY KEY,
  items            JSONB NOT NULL DEFAULT '[]',
  shipping_details JSONB NOT NULL DEFAULT '{}',
  payment_details  JSONB NOT NULL DEFAULT '{}',
  subtotal         INTEGER DEFAULT 0,
  discount         INTEGER DEFAULT 0,
  tax              INTEGER DEFAULT 0,
  shipping         INTEGER DEFAULT 0,
  total            INTEGER NOT NULL,
  status           TEXT NOT NULL DEFAULT 'Placed',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON public.orders;
CREATE POLICY "Allow all" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────
-- 3. COUPONS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupons (
  code         TEXT PRIMARY KEY,
  discount     INTEGER NOT NULL,
  min_purchase INTEGER DEFAULT 0,
  description  TEXT DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON public.coupons;
CREATE POLICY "Allow all" ON public.coupons FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────
-- 4. SEED: DEFAULT COUPONS
-- ─────────────────────────────────────────────
INSERT INTO public.coupons (code, discount, min_purchase, description) VALUES
  ('MILLETLIFE10', 10, 500,  'Get 10% OFF on purchases above ₹500'),
  ('NATURAL20',    20, 1000, 'Get 20% OFF on purchases above ₹1,000'),
  ('GYMPOWER30',   30, 1500, 'Fitness Special: Get 30% OFF on purchases above ₹1,500'),
  ('FIRSTFIT',     15, 0,    'Welcome Coupon: Get 15% OFF on your first purchase!')
ON CONFLICT (code) DO NOTHING;

-- ─────────────────────────────────────────────
-- 5. SEED: ALL PRODUCTS
-- ─────────────────────────────────────────────
INSERT INTO public.products (id, name, category, price, quantity, badge, description, image, rating, reviews_count, variants, nutrition) VALUES

-- READY MIX
('rm-kichdi', 'Kichdi Premix', 'Ready Mix', 240, '500 g', 'Best Seller',
 'A nourishing, low-glycemic, and fiber-rich ready-to-cook meal made with the finest natural millets and roasted lentils. Perfect for a quick, gut-friendly breakfast or dinner.',
 '/kichdi-premix.png', 4.8, 340,
 '["Pearl Millet","Finger Millet","Kodo Millet","Browntop Millet","Barnyard Millet","Foxtail Millet","Little Millet","Proso Millets","Multi Millets"]',
 '{"protein":"12g","fiber":"8.5g","carbs":"62g","fat":"2.1g"}'),

('rm-dosa', 'Dosa Premix', 'Ready Mix', 240, '500 g', 'Top Rated',
 'Prepare crispy, golden, and highly nutritious dosas in minutes. Naturally fermented, gluten-free, and packed with high protein and essential minerals.',
 '/dosa-mix.png', 4.9, 412,
 '["Pearl Millet","Finger Millet","Kodo Millet","Browntop Millet","Barnyard Millet","Foxtail Millet","Little Millet","Proso Millets","Multi Millets"]',
 '{"protein":"14g","fiber":"9.2g","carbs":"60g","fat":"1.8g"}'),

('rm-rava-dosa', 'Rava Dosa Premix', 'Ready Mix', 240, '500 g', 'Crispy Delight',
 'Instant, super crispy, restaurant-style Rava Dosa blend crafted with fiber-rich millets, semolina, cumin seeds, and pepper. No fermentation required!',
 '/rava-dosa-mix.png', 4.7, 228,
 '["Pearl Millet","Finger Millet","Kodo Millet","Browntop Millet","Barnyard Millet","Foxtail Millet","Little Millet","Proso Millets","Multi Millets"]',
 '{"protein":"11.5g","fiber":"7.8g","carbs":"64g","fat":"2.3g"}'),

('rm-upma', 'Upma Premix', 'Ready Mix', 240, '500 g', 'Best Seller',
 'A traditional wholesome South Indian breakfast enriched with toasted millets, curry leaves, mustard seeds, and premium natural spices. Just add hot water!',
 '/upma-mix.png', 4.6, 194,
 '["Pearl Millet","Finger Millet","Kodo Millet","Browntop Millet","Barnyard Millet","Foxtail Millet","Little Millet","Proso Millets","Multi Millets"]',
 '{"protein":"13g","fiber":"10.1g","carbs":"59g","fat":"2.5g"}'),

-- FREEZE DRIED POWDERS
('pw-chutney', 'Chutney Powder', 'Freeze Dried Powders', 80, '50 g', 'Must Try',
 'Traditional spicy, tangy, and nutty chutney powder made with lentils, roasted seeds, dry red chillies, and premium asafoetida.',
 '/chutney-powder.png', 4.8, 148, '[]', '{"protein":"18g","fiber":"12g","carbs":"42g","fat":"6.8g"}'),

('pw-rasam', 'Rasam Powder', 'Freeze Dried Powders', 80, '50 g', 'Immunity Booster',
 'Highly aromatic, traditional South Indian soup spices powder. Formulated with black pepper, cumin, coriander, and natural turmeric to boost immunity.',
 '/rasam-powder.png', 4.7, 120, '[]', '{"protein":"8.5g","fiber":"16g","carbs":"45g","fat":"4.2g"}'),

('pw-sambar', 'Sambar Powder', 'Freeze Dried Powders', 80, '50 g', 'Authentic Taste',
 'Authentic, handcrafted blend of premium spices and lentils, roasted perfectly to create the ultimate rich, thick, and delicious sambar stew.',
 '/sambar-powder.png', 4.9, 185, '[]', '{"protein":"12g","fiber":"14g","carbs":"48g","fat":"3.5g"}'),

('pw-karam', 'Karam Powder', 'Freeze Dried Powders', 80, '50 g', 'Spicy & Bold',
 'A spicy Andhra-style garlic and red chili spice mix. Adds an instant kick and premium flavor profile when drizzled on hot millets with ghee.',
 '/karam-powder.png', 4.6, 95, '[]', '{"protein":"9g","fiber":"11g","carbs":"50g","fat":"5.5g"}'),

('pw-sprout', 'Sprout Powder', 'Freeze Dried Powders', 80, '50 g', 'Best Seller',
 'Highly nutritious powder milled from carefully sprouted multi-millets and green grams. Ideal health drink mix for kids, athletes, and fitness enthusiasts.',
 '/sprout-powder.png', 4.8, 167, '[]', '{"protein":"22g","fiber":"14.2g","carbs":"52g","fat":"1.5g"}'),

('pw-beetroot', 'Beetroot Powder', 'Freeze Dried Powders', 120, '100 g', 'Pre-Workout',
 '100% pure, dehydrated natural beetroot powder. Rich in nitrates, increases oxygen intake, and serves as a natural pre-workout booster and colorant.',
 '/beetroot-powder.png', 4.7, 88, '[]', '{"protein":"10g","fiber":"11g","carbs":"70g","fat":"0.5g"}'),

('pw-onion', 'Onion Powder', 'Freeze Dried Powders', 110, '100 g', 'Kitchen Staple',
 'Saves preparation time and packs intense savory onion flavor. Made from premium, slowly dehydrated onions. Perfect for seasoning and quick cooking.',
 '/onion-powder.png', 4.5, 64, '[]', '{"protein":"9.5g","fiber":"8.2g","carbs":"75g","fat":"0.2g"}'),

('pw-amla', 'Amla Powder', 'Freeze Dried Powders', 130, '100 g', 'Vitamin C Rich',
 'Pure Indian Gooseberry powder, packed with Vitamin C and powerful antioxidants. Promotes strong immunity, radiant skin, and digestive health.',
 '/amla-powder.png', 4.9, 204, '[]', '{"protein":"4g","fiber":"25g","carbs":"58g","fat":"0.5g"}'),

('pw-mango', 'Mango Powder', 'Freeze Dried Powders', 95, '100 g', 'Tangy Twist',
 'Tangy and sour Amchur (Dry Mango) powder made from handpicked raw green mangoes. Elevates chat, curries, and snack seasonings with a premium tanginess.',
 '/mango-powder.png', 4.6, 72, '[]', '{"protein":"3g","fiber":"8g","carbs":"78g","fat":"0.8g"}'),

('pw-tomato', 'Tomato Powder', 'Freeze Dried Powders', 110, '100 g', '100% Natural',
 'Rich, tangy dehydrated red tomato powder. Ideal for instantly flavoring soups, sauces, pasta, instant noodles, and popcorn seasoning.',
 '/tomato-powder.png', 4.5, 53, '[]', '{"protein":"12g","fiber":"9g","carbs":"62g","fat":"1.2g"}'),

('pw-potato', 'Potato Powder', 'Freeze Dried Powders', 90, '100 g', 'Thickener',
 'Dehydrated potato flakes powder. Serves as a perfect thickening agent for healthy creamy soups and base mixes, or for making gluten-free flatbreads.',
 '/potato-powder.png', 4.3, 42, '[]', '{"protein":"7g","fiber":"6g","carbs":"80g","fat":"0.1g"}'),

('pw-jackfruit', 'Jackfruit Powder', 'Freeze Dried Powders', 140, '100 g', 'Sugar Control',
 'Clinically proven to help manage blood sugar levels. Made from 100% green jackfruit, neutral in taste, and can be mixed into standard dosa, idli, or wheat batter.',
 '/jackfruit-powder.png', 4.8, 156, '[]', '{"protein":"8g","fiber":"22g","carbs":"68g","fat":"0.3g"}'),

('pw-banana-flower', 'Banana Flower Powder', 'Freeze Dried Powders', 150, '100 g', 'Wellness Choice',
 'An ancient therapeutic powder that balances hormones, relieves stomach pain, and acts as an exceptional lactation support and digestive tonic.',
 '/banana-flower-powder.png', 4.7, 78, '[]', '{"protein":"9.8g","fiber":"18.5g","carbs":"62g","fat":"0.4g"}'),

('pw-ginger', 'Ginger Powder', 'Freeze Dried Powders', 120, '100 g', 'Antioxidant',
 'Highly potent dehydrated ginger root (Sonth) powder. Incredible spice for tea, baking, curries, and a verified natural remedy for coughs and colds.',
 '/ginger-powder.png', 4.8, 92, '[]', '{"protein":"8.9g","fiber":"14.1g","carbs":"68g","fat":"1.9g"}'),

('pw-garlic', 'Garlic Powder', 'Freeze Dried Powders', 110, '100 g', 'Rich Flavor',
 'Deep, aromatic garlic seasoning. Carefully dehydrated from premium garlic cloves. Perfect to season veggies, garlic breads, soups, and healthy marinades.',
 '/garlic-powder.png', 4.6, 114, '[]', '{"protein":"16g","fiber":"9g","carbs":"70g","fat":"0.7g"}'),

('pw-mint', 'Mint Powder', 'Freeze Dried Powders', 95, '100 g', 'Cooling & Fresh',
 'Extremely refreshing dehydrated natural mint leaves powder. Enhances cooling raitas, spiced buttermilk, biryanis, lemonades, and marinades.',
 '/mint-powder.png', 4.7, 81, '[]', '{"protein":"3.8g","fiber":"12g","carbs":"52g","fat":"0.6g"}'),

('pw-moringa', 'Moringa Powder', 'Freeze Dried Powders', 135, '100 g', 'Superfood Green',
 'A nutrient-packed green superfood powder milled from shade-dried natural Moringa leaves. Rich in iron, calcium, amino acids, and multivitamins.',
 '/moringa-powder.png', 4.9, 265, '[]', '{"protein":"27g","fiber":"19.2g","carbs":"38g","fat":"2.3g"}'),

('pw-bootroot', 'Bootroot Powder', 'Freeze Dried Powders', 120, '100 g', 'Nitrate Rich',
 'Dehydrated premium beetroots, exceptional pre-workout nitrate source for explosive pumps.',
 '/bootroot-powder.png', 4.8, 94, '[]', '{"protein":"10g","fiber":"11g","carbs":"70g","fat":"0.5g"}'),

('pw-gongura', 'Gongura Powder', 'Freeze Dried Powders', 90, '100 g', 'Iron Rich',
 'High iron and calcium sour greens powder. Rich in vitamin C and active antioxidants.',
 '/gongura-powder.png', 4.7, 76, '[]', '{"protein":"8g","fiber":"14g","carbs":"55g","fat":"0.8g"}'),

('pw-menthi', 'Menthi Powder', 'Freeze Dried Powders', 85, '100 g', 'Sugar Control',
 'Traditional fenugreek seeds powder. Effectively controls blood sugar levels and improves digestion.',
 '/menthi-powder.png', 4.6, 88, '[]', '{"protein":"23g","fiber":"24g","carbs":"48g","fat":"6.4g"}'),

('pw-ponaganti', 'Ponaganti Powder', 'Freeze Dried Powders', 95, '100 g', 'Eye Health',
 'Traditional green leaf powder, exceptional for eye health and cooling the body during heat.',
 '/ponaganti-powder.png', 4.8, 62, '[]', '{"protein":"11g","fiber":"12g","carbs":"45g","fat":"0.6g"}'),

('pw-curry-leaves', 'Curry Leaves Powder', 'Freeze Dried Powders', 85, '100 g', 'Hair & Skin',
 'Nutrient-dense seasoning powder, boosts hair health, scalp nutrition, and naturally improves iron levels.',
 '/curry-leaves-powder.png', 4.9, 145, '[]', '{"protein":"12g","fiber":"15g","carbs":"42g","fat":"1.0g"}'),

('pw-yevallu', 'Yevallu Powder', 'Freeze Dried Powders', 110, '100 g', 'Weight Loss',
 'Premium barley powder. Superb detox agent, helps flush toxins and aids clean weight management.',
 '/yevallu-powder.png', 4.5, 52, '[]', '{"protein":"12g","fiber":"17g","carbs":"73g","fat":"1.2g"}'),

('pw-ulvacharu', 'Ulvacharu Powder', 'Freeze Dried Powders', 115, '100 g', 'High Protein',
 'Horse gram soup mix powder. Extremely high in protein, acts as an active fat-burner and muscle toner.',
 '/ulvacharu-powder.png', 4.8, 118, '[]', '{"protein":"22g","fiber":"12g","carbs":"57g","fat":"0.5g"}'),

('pw-flax-seeds', 'Flax Seeds Powder', 'Freeze Dried Powders', 130, '100 g', 'Omega-3 Rich',
 'Dehydrated roasted flax seeds. Loaded with Omega-3 fatty acids for premium heart and joint health.',
 '/flax-seeds-powder.png', 4.7, 139, '[]', '{"protein":"18g","fiber":"27g","carbs":"29g","fat":"42g"}'),

('pw-menthula', 'Menthula Powder', 'Freeze Dried Powders', 85, '100 g', 'Digestion Aid',
 'Dehydrated fenugreek leaves (kasuri methi) powder. Highly aromatic spice that boosts digestion.',
 '/menthula-powder.png', 4.7, 71, '[]', '{"protein":"23g","fiber":"25g","carbs":"44g","fat":"6.0g"}'),

('pw-red-chilli', 'Red Chilli Powder', 'Freeze Dried Powders', 80, '100 g', 'Metabolism',
 'Premium stone-ground spicy Guntur red chillies for an essential metabolic boost.',
 '/red-chilli-powder.png', 4.6, 104, '[]', '{"protein":"12g","fiber":"34g","carbs":"32g","fat":"14g"}'),

('pw-pasupu', 'Pasupu Powder', 'Freeze Dried Powders', 90, '100 g', 'Curcumin Active',
 'Premium turmeric powder with exceptionally high curcumin content, acting as a powerful anti-inflammatory.',
 '/pasupu-powder.png', 4.9, 182, '[]', '{"protein":"8g","fiber":"21g","carbs":"65g","fat":"3.0g"}'),

('pw-saindhava-lavanam', 'Saindhava Lavanam', 'Freeze Dried Powders', 75, '100 g', 'Trace Minerals',
 'Pure pink rock salt powder, loaded with 84 trace minerals to help regulate natural hydration.',
 '/saindhava-lavanam.png', 4.8, 110, '[]', '{"protein":"0g","fiber":"0g","carbs":"0g","fat":"0g"}'),

('pw-dhaniya', 'Dhaniya Powder', 'Freeze Dried Powders', 85, '100 g', 'Heart Health',
 'High-quality coriander seed powder, improves digestion and supports general cardiovascular health.',
 '/dhaniya-powder.png', 4.7, 93, '[]', '{"protein":"12g","fiber":"41g","carbs":"55g","fat":"17g"}'),

('pw-banana', 'Banana Powder', 'Freeze Dried Powders', 140, '100 g', 'Gut Friendly',
 'Dehydrated raw green banana powder, full of resistant starch to feed the gut microbiome.',
 '/banana-powder.png', 4.8, 84, '[]', '{"protein":"4g","fiber":"10g","carbs":"80g","fat":"0.5g"}'),

('pw-coconut', 'Coconut Powder', 'Freeze Dried Powders', 95, '100 g', 'MCT Energy',
 'Grated dehydrated coconut powder, excellent source of MCT fats for instant clean athletic energy.',
 '/coconut-powder.png', 4.8, 122, '[]', '{"protein":"7g","fiber":"16g","carbs":"24g","fat":"65g"}'),

('pw-yelakkaya', 'Yelakkaya Powder', 'Freeze Dried Powders', 250, '50 g', 'Premium Spice',
 'Pure premium green cardamom powder, incredible natural mouth freshener and stress reliever.',
 '/yelakkaya-powder.png', 4.9, 198, '[]', '{"protein":"11g","fiber":"28g","carbs":"68g","fat":"7g"}'),

('pw-tamarind', 'Tamarind Powder', 'Freeze Dried Powders', 90, '100 g', 'Tangy & Sour',
 'Tangy dehydrated raw tamarind powder, packed with natural tartaric acid to aid gut motility.',
 '/tamarind-powder.png', 4.6, 67, '[]', '{"protein":"3g","fiber":"5g","carbs":"62g","fat":"0.6g"}'),

('pw-jilakara', 'Jilakara Powder', 'Freeze Dried Powders', 95, '100 g', 'Digestive Boost',
 'Roasted cumin seed powder, outstanding digestive aid and metabolic performance booster.',
 '/jilakara-powder.png', 4.8, 140, '[]', '{"protein":"18g","fiber":"10g","carbs":"44g","fat":"22g"}'),

-- INSTANT MIX
('im-instant-upma', 'Instant Upma', 'Instant Mix', 60, '80 g Cup', 'Travel Friendly',
 'Office and travel friendly single-serving cup of delicious, healthy millet upma. Just add boiling water to the cup, wait for 3 minutes, and enjoy!',
 '/instant-upma.png', 4.5, 110, '[]', '{"protein":"9.2g","fiber":"7.5g","carbs":"55g","fat":"3.2g"}'),

('im-rawa-dosa', 'Rawa Dosa Mixture', 'Instant Mix', 140, '500 g', 'Crispy Lace',
 'Prepare paper-thin, laced, crispy rava dosas within minutes. Made from stone-ground millets, black pepper, ginger extracts, and natural herbs.',
 '/rawa-dosa-mixture.png', 4.7, 142, '[]', '{"protein":"11g","fiber":"8.2g","carbs":"65g","fat":"2.1g"}'),

-- NOODLES
('nd-noodles', 'Millet Noodles', 'Noodles', 150, '2 Packets', 'Gym Special',
 'Healthy, air-dried (never fried!) noodles made from pure millet flours and wheat. 100% MSG-free, no preservatives, comes with an all-natural taste maker spice packet.',
 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&auto=format&fit=crop',
 4.9, 520,
 '["Foxtail Millet","Finger Millet","Pearl Millet","Multi Millet"]',
 '{"protein":"15g","fiber":"11g","carbs":"58g","fat":"1.2g"}'),

-- SOUPS
('sp-soup', 'Millet Soup Powder', 'Soups', 150, '2 Packets', 'Calorie Conscious',
 'A nourishing and comforting hot millet soup powder. Perfectly spiced with black pepper, ginger, and garlic, packed with premium dehydrated real vegetable bits.',
 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600&auto=format&fit=crop',
 4.8, 298,
 '["Foxtail Millet","Finger Millet","Pearl Millet","Multi Millet"]',
 '{"protein":"10.5g","fiber":"13g","carbs":"50g","fat":"0.8g"}'),

-- HOT MEALS
('hm-veg-pulao', 'Mixed Veg Pulao', 'Hot Meal', 150, '1 Serving', 'Veg Special',
 'A steaming hot, healthy natural millet pulao loaded with fresh garden vegetables and mild spices.',
 '/mixed-veg-pulao.png', 4.8, 142, '[]', '{"protein":"12g","fiber":"9g","carbs":"60g","fat":"3.2g"}'),

('hm-veg-pudina', 'Pudina Millet Meal', 'Hot Meal', 150, '1 Serving', 'Fresh Mint',
 'Freshly prepared millet meal cooked with a cooling and aromatic mint (pudina) paste and fresh herbs.',
 '/pudina-millet-meal.png', 4.7, 95, '[]', '{"protein":"11.5g","fiber":"9.5g","carbs":"58g","fat":"3.0g"}'),

('hm-veg-jeera', 'Jeera Millet Meal', 'Hot Meal', 150, '1 Serving', 'Digestive Aid',
 'Light and flavorful natural cumin-infused millet meal, cooked to fluffy perfection with a touch of ghee.',
 '/jeera-millet-meal.png', 4.6, 110, '[]', '{"protein":"11.0g","fiber":"8.8g","carbs":"62g","fat":"3.5g"}'),

('hm-veg-coconut', 'Coconut Millet Meal', 'Hot Meal', 150, '1 Serving', 'Rich & Nutty',
 'Rich, nutty, and satisfying millet meal cooked with fresh grated natural coconut and tempered mustard seeds.',
 '/coconut-millet-meal.png', 4.7, 88, '[]', '{"protein":"10.8g","fiber":"10.2g","carbs":"55g","fat":"5.8g"}'),

('hm-veg-sambar', 'Sambar Millet Meal', 'Hot Meal', 150, '1 Serving', 'Comfort Food',
 'Wholesome, comforting pre-mixed millet porridge cooked with authentic South Indian lentil sambar and veggies.',
 '/sambar-millet-meal.png', 4.8, 175, '[]', '{"protein":"13.2g","fiber":"11.0g","carbs":"57g","fat":"2.8g"}'),

('hm-veg-tamarind', 'Millet Tamarind Pulihora', 'Hot Meal', 150, '1 Serving', 'Tangy Delight',
 'Traditional tangy and spicy tamarind millet rice (Pulihora) tempered with roasted peanuts and curry leaves.',
 '/tamarind-pulihora.png', 4.9, 130, '[]', '{"protein":"11.2g","fiber":"9.0g","carbs":"64g","fat":"4.2g"}'),

('hm-veg-raagi-soya', 'Raagi Sankati + Soya curry', 'Hot Meal', 150, '1 Serving', 'Protein Rich',
 'Nutrient-dense finger millet (ragi) balls served with a high-protein, flavorful soya chunk curry.',
 '/ragi-soya-curry.png', 4.8, 154, '[]', '{"protein":"18.5g","fiber":"12.5g","carbs":"52g","fat":"2.5g"}'),

('hm-veg-raagi-chickpeas', 'Raagi Sankati + Chickpeas curry', 'Hot Meal', 150, '1 Serving', 'High Fiber',
 'Traditional ragi balls served with a delicious, spiced black chickpeas (Kala Chana) curry.',
 '/ragi-chickpeas-curry.png', 4.7, 112, '[]', '{"protein":"16.8g","fiber":"14.0g","carbs":"54g","fat":"2.8g"}'),

('hm-nonveg-mutton-kheema', 'Mutton Kheema Pulao', 'Hot Meal', 205, '1 Serving', 'Chef Special',
 'Rich, aromatic millet pulao cooked with minced, spiced natural mutton (kheema). A gourmet protein powerhouse.',
 '/mutton-kheema-pulao.png', 4.9, 168, '[]', '{"protein":"28g","fiber":"8.5g","carbs":"50g","fat":"7.2g"}'),

('hm-nonveg-chicken-pulao', 'Chicken Pulao', 'Hot Meal', 205, '1 Serving', 'Gym Favourite',
 'Flavourful and delicious non-veg pulao cooked with tender chicken pieces and natural millets.',
 '/chicken-pulao.png', 4.8, 215, '[]', '{"protein":"26g","fiber":"8.0g","carbs":"52g","fat":"5.8g"}'),

('hm-nonveg-raagi-mutton', 'Raagi Sankati + Mutton curry', 'Hot Meal', 205, '1 Serving', 'Athletes Choice',
 'Classic high-energy ragi balls served with a spicy, rich, traditional mutton curry gravy.',
 '/ragi-mutton-curry.png', 4.9, 184, '[]', '{"protein":"29g","fiber":"11.2g","carbs":"48g","fat":"7.8g"}'),

('hm-nonveg-raagi-naatukodi', 'Raagi Sankati + Naatukodi curry', 'Hot Meal', 205, '1 Serving', 'Rustic Feast',
 'Country chicken (Naatukodi) spicy curry served alongside traditional wholesome ragi balls.',
 '/ragi-natukodi-curry.png', 4.8, 148, '[]', '{"protein":"27.5g","fiber":"11.0g","carbs":"49g","fat":"6.9g"}')

ON CONFLICT (id) DO NOTHING;


-- ─────────────────────────────────────────────
-- 6. ADMIN CONFIG TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;

-- Allow read/write access to the table
DROP POLICY IF EXISTS "Allow all" ON public.admin_config;
CREATE POLICY "Allow all" ON public.admin_config FOR ALL USING (true) WITH CHECK (true);

-- Insert the default password (9989551305)
INSERT INTO public.admin_config (key, value)
VALUES ('password', '9989551305')
ON CONFLICT (key) DO NOTHING;

