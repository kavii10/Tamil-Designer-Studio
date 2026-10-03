-- ==============================================================================
-- TAMIL DESIGNER STUDIO — Services Table Fix & Full Sync
-- Run this ENTIRE script in Supabase SQL Editor
-- Go to: https://supabase.com → Your Project → SQL Editor → New Query → Paste & Run
-- ==============================================================================

-- STEP 1: Delete old rows that have auto-generated UUID ids (not s1–s9)
-- This clears out the bad seed data from the first run
DELETE FROM public.services
WHERE id NOT IN ('s1','s2','s3','s4','s5','s6','s7','s8','s9');

-- STEP 2: Upsert all 9 services with their correct string IDs (s1–s9)
-- This ensures the admin dashboard can properly update/sync across all devices
INSERT INTO public.services (id, title, description, icon_name, image_url, items, is_active, sort_order) VALUES

('s1',
 'Kids Pattu Lehenga Dress',
 'Traditional Pattu Lehenga, Pavadai Sattai & ethnic girls outfits stitched to perfection for festivals and celebrations.',
 'Star',
 '/services/kids_pattu_lehenga.jpg',
 '["Pattu Pavadai", "Langa Voni", "Lehenga Blouse", "Festive Frocks", "Half Saree Sets"]'::jsonb,
 TRUE, 1),

('s2',
 'Traditional Indian Attires for Kids',
 'Classic Indian ethnic wear for children — churidars, salwars, and traditional dresses stitched with care.',
 'Sparkles',
 '/services/kids_traditional_attire.jpg',
 '["Churidar Sets", "Salwar Kameez", "Kurti & Pant", "Kid''s Ethnic Wear", "School Uniform Stitching"]'::jsonb,
 TRUE, 2),

('s3',
 'Designer Gown & Anarkali Stitching',
 'Stunning Anarkali suits, floor-length gowns, and designer party wear crafted with premium fabric.',
 'Sparkles',
 '/services/designer_gown_anarkali.jpg',
 '["Anarkali Suits", "Long Gowns", "Maxi Variations", "Western Outfits", "Party Wear Gowns"]'::jsonb,
 TRUE, 3),

('s4',
 'Bridal Blouse Designs',
 'Exquisite bridal blouses with intricate hand work, silk and brocade fabric stitching for your most special day.',
 'Heart',
 '/services/bridal_blouse_designs.jpg',
 '["Bridal Silk Blouse", "Wedding Blouse", "Embroidery Blouse", "Stone Work Blouse", "Zardosi Blouse"]'::jsonb,
 TRUE, 4),

('s5',
 'Aari Works & Embroidery',
 'Hand-crafted Aari embroidery work on blouses, dupattas, and garments with traditional patterns and modern elegance.',
 'Sparkles',
 '/services/aari_embroidery_works.jpg',
 '["Aari Thread Work", "Zardosi Work", "Cutdana Work", "Mirror Work", "Maggam Embroidery"]'::jsonb,
 TRUE, 5),

('s6',
 'Blouse & Lehenga Stitching',
 'Blouse variations, lehenga skirts, and matching sets with perfect fitting across all fabric types.',
 'Scissors',
 '/services/blouse_lehenga_stitching.jpg',
 '["Blouse Variations", "Lehenga Skirts", "Kurti Variations", "Pant Variations", "Nightwear"]'::jsonb,
 TRUE, 6),

('s7',
 'Anarkali & Gown Stitching',
 'Elegant Anarkali and gown stitching with fine-tuned draping, lining, and precision finishing.',
 'Sparkles',
 '/services/anarkali_gown_stitching.jpg',
 '["Anarkali Stitching", "Long Gown", "Cape Gown", "Palazzo Suits", "Sharara Sets"]'::jsonb,
 TRUE, 7),

('s8',
 'Trendy & Stylish Blouse Designs',
 'Contemporary and trendy blouse designs — backless, collar neck, off-shoulder, and latest pattern blouses.',
 'Shirt',
 '/services/trendy_stylish_blouse.jpg',
 '["Designer Blouse", "Collar Neck", "Puff Sleeve", "Off-Shoulder", "Backless Blouse"]'::jsonb,
 TRUE, 8),

('s9',
 'Prepleating Services',
 'Professional saree prepleating, expert draping, precision pinning, ironing, box & hanger folding, and buffy pleats.',
 'Scissors',
 '/services/saree_draping.jpg',
 '["Saree Draping", "Saree Prepleating", "Pinning Techniques", "Ironing Method", "Box Folding", "Hanger Folding", "Buffy Pleats"]'::jsonb,
 TRUE, 9)

ON CONFLICT (id) DO UPDATE SET
  title       = EXCLUDED.title,
  description = EXCLUDED.description,
  icon_name   = EXCLUDED.icon_name,
  image_url   = EXCLUDED.image_url,
  items       = EXCLUDED.items,
  is_active   = EXCLUDED.is_active,
  sort_order  = EXCLUDED.sort_order;

-- STEP 3: Also fix courses to ensure they are properly seeded with IDs
INSERT INTO public.courses (id, title, level, badge, description, topics, is_active, sort_order) VALUES

('c1', 'Blouse Variations', 'Advanced', '18 Variations',
 'Master 18 bespoke designer blouse patterns — from royal princess cuts and Sabyasachi styles to modern halter and tube blouses.',
 '["Body analysis", "Armhole princess blouse", "Sleeveless princess blouse", "Halter neck blouse", "Tube blouse", "Boat neck blouse", "Shawl collar blouse", "Half Chinese collar blouse", "Princess cut with waist band", "One dart blouse", "Illusion neck blouse", "3 Dart blouse", "4 Dart blouse", "Madhubala blouse", "Katori blouse", "Sabyasachi blouse", "Blouse layout", "Elastic attachment blouse"]'::jsonb,
 TRUE, 1),

('c2', 'Kurti Variations', 'Intermediate', '12 Variations',
 'Learn pattern drafting and stitching for 12 trending kurti styles, collars, asymmetric hemlines, and comfort fits.',
 '["Straight kurti", "Packed neck kurti", "Side knot kurti", "Deep neck kurti", "Deep neck sleeveless kurti", "A-line kurti", "Flat collar kurti", "Shirt collar kurti", "Princess cut kurti", "High-low kurti", "Angrakha kurti", "Plus size kurti"]'::jsonb,
 TRUE, 2),

('c3', 'Pant Variations', 'Intermediate', '7 Variations',
 'Master 7 bottom-wear styles including tailored cigarette pants, palazzo flare, and ethnic salwars.',
 '["Palazzo pants", "Cigarette pants", "High waist pants", "Patiala pants", "Salwar pants", "Jeans", "Leggings"]'::jsonb,
 TRUE, 3),

('c4', 'Maxi Variations', 'Advanced', '11 Variations',
 'Create floor-length maxi dresses, circular flares, tiered panels, and stunning saree-to-gown upcycling creations.',
 '["Full circular maxi", "Double circular maxi", "Half circular maxi", "Shoulder princess pleated maxi", "Gathered over coat maxi", "Pleated maxi", "3 Tiered maxi", "Full panel maxi", "Yoke panel maxi", "A-line maxi", "Saree to gown maxi"]'::jsonb,
 TRUE, 4),

('c5', 'Full Set & Ethnic Ensembles', 'Specialized', 'Complete Sets',
 'Craft matching festive wear ensembles, royal Madhubala co-ords, and trending sharara suits.',
 '["Madhubala set", "2 Piece set", "Sharara"]'::jsonb,
 TRUE, 5),

('c6', 'Western Outfits', 'Couture', '9 Outfits',
 'Contemporary western fashion techniques — shirts, corsetry, jumpsuits, peplum, kaftan, and structural outerwear.',
 '["Women''s shirt", "Peplum top", "Kaftan", "Crop top", "One piece", "Corset", "Jumpsuit", "Shirred top", "Over coat"]'::jsonb,
 TRUE, 6),

('c7', 'Saree Prepleating Class', 'Specialized', 'Signature Masterclass',
 'Professional saree draping, precision pleating, pinning, ironing, box & hanger folding, and boutique packaging techniques.',
 '["Saree draping", "Saree prepleating", "Pinning techniques", "Ironing method", "Box folding", "Hanger folding", "Buffy pleats"]'::jsonb,
 TRUE, 7)

ON CONFLICT (id) DO UPDATE SET
  title       = EXCLUDED.title,
  level       = EXCLUDED.level,
  badge       = EXCLUDED.badge,
  description = EXCLUDED.description,
  topics      = EXCLUDED.topics,
  is_active   = EXCLUDED.is_active,
  sort_order  = EXCLUDED.sort_order;

-- STEP 4: Verify the fix — should show 9 services and 7 courses
SELECT 'SERVICES' as table_name, id, title, is_active, sort_order FROM public.services ORDER BY sort_order
UNION ALL
SELECT 'COURSES' as table_name, id, title, is_active, sort_order FROM public.courses ORDER BY sort_order;
