-- ==============================================================================
-- TAMIL DESIGNER STUDIO — Dynamic QR Manager & Digital Business Card Schema
-- Database: PostgreSQL / Supabase
-- Project: https://kfjseiiudjmadbwjmcvm.supabase.co
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. QR CODES TABLE
-- Controls the permanent QR slugs and their dynamic destination targets
CREATE TABLE IF NOT EXISTS public.qr_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    destination_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    scan_count BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BUSINESS SETTINGS TABLE
-- Powers the public digital business card dynamically from admin
CREATE TABLE IF NOT EXISTS public.business_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(255) NOT NULL DEFAULT 'Tamil Designer Studio',
    subtitle VARCHAR(255) NOT NULL DEFAULT 'School of Fashion Design & Tailoring',
    tagline VARCHAR(255) NOT NULL DEFAULT 'Wear Dreams, Not Just Clothes.',
    quote VARCHAR(255) NOT NULL DEFAULT 'Where Fabric Meets Imagination',
    phone VARCHAR(50) NOT NULL DEFAULT '78452 64168',
    phone_raw VARCHAR(50) NOT NULL DEFAULT '917845264168',
    whatsapp_url TEXT NOT NULL DEFAULT 'https://wa.me/917845264168?text=Hello%20Tamil%20Designer%20Studio%2C%20I%20would%20like%20to%20know%20more%20about%20your%20tailoring%20classes%20and%20stitching%20services.',
    instagram_url TEXT NOT NULL DEFAULT 'https://instagram.com/tamil_designer_studio',
    maps_url TEXT NOT NULL DEFAULT 'https://www.google.com/maps/place/11%C2%B003''18.8%22N+77%C2%B003''52.4%22E/@11.0552243,77.0619922,17z/data=!3m1!4b1!4m4!3m3!8m2!3d11.0552243!4d77.0645671?hl=en&entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D',
    website_url TEXT DEFAULT '',
    address_line1 VARCHAR(255) NOT NULL DEFAULT '1/208 C, Jeeva Street',
    address_line2 VARCHAR(255) NOT NULL DEFAULT 'Chinniyampalayam',
    address_city VARCHAR(100) NOT NULL DEFAULT 'Coimbatore',
    address_pincode VARCHAR(20) NOT NULL DEFAULT '641062',
    timings_weekdays VARCHAR(255) NOT NULL DEFAULT 'Weekdays: 9:00 AM – 1:00 PM & 3:00 PM – 8:00 PM',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COURSES TABLE
-- Courses and masterclasses offered at the academy
CREATE TABLE IF NOT EXISTS public.courses (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    level VARCHAR(100) NOT NULL, -- 'Beginner', 'Intermediate', 'Advanced', 'Specialized'
    badge VARCHAR(100),
    description TEXT,
    topics JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SERVICES TABLE
-- Tailoring and bespoke designer services
CREATE TABLE IF NOT EXISTS public.services (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon_name VARCHAR(100) DEFAULT 'Sparkles',
    image_url TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SCAN LOGS TABLE
-- Anonymous scan metrics recorded upon visiting /qr/:slug
CREATE TABLE IF NOT EXISTS public.scan_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    qr_code_id UUID REFERENCES public.qr_codes(id) ON DELETE CASCADE,
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    device_type VARCHAR(50), -- 'mobile', 'tablet', 'desktop', 'unknown'
    browser VARCHAR(100),
    os VARCHAR(100),
    user_agent TEXT,
    referrer TEXT,
    ip_hash VARCHAR(64)
);

-- Indexes for maximum scan and lookup speed
CREATE INDEX IF NOT EXISTS idx_qr_codes_slug ON public.qr_codes(slug);
CREATE INDEX IF NOT EXISTS idx_scan_logs_qr_id ON public.scan_logs(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_scan_logs_scanned_at ON public.scan_logs(scanned_at);

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_qr_codes_updated_at ON public.qr_codes;
CREATE TRIGGER trg_qr_codes_updated_at
BEFORE UPDATE ON public.qr_codes
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

DROP TRIGGER IF EXISTS trg_business_settings_updated_at ON public.business_settings;
CREATE TRIGGER trg_business_settings_updated_at
BEFORE UPDATE ON public.business_settings
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- RPC Function for high-concurrency scan counting
CREATE OR REPLACE FUNCTION increment_qr_scan(qr_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.qr_codes
    SET scan_count = COALESCE(scan_count, 0) + 1
    WHERE id = qr_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_logs ENABLE ROW LEVEL SECURITY;

-- Allow full access for anon/authenticated to operate the dashboard seamlessly
DROP POLICY IF EXISTS "Public full access to qr_codes" ON public.qr_codes;
CREATE POLICY "Public full access to qr_codes" 
ON public.qr_codes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to business_settings" ON public.business_settings;
CREATE POLICY "Public full access to business_settings" 
ON public.business_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to courses" ON public.courses;
CREATE POLICY "Public full access to courses" 
ON public.courses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to services" ON public.services;
CREATE POLICY "Public full access to services" 
ON public.services FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to scan_logs" ON public.scan_logs;
CREATE POLICY "Public full access to scan_logs" 
ON public.scan_logs FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA FOR TAMIL DESIGNER STUDIO
-- ==============================================================================

-- 1. Default Permanent Visiting Card QR
INSERT INTO public.qr_codes (id, name, slug, destination_url, is_active, scan_count)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Tamil Designer Studio — Visiting Card QR',
    'tamil-designer-studio',
    '/tamil-designer-studio',
    TRUE,
    0
) ON CONFLICT (slug) DO UPDATE 
SET destination_url = EXCLUDED.destination_url;

-- 2. Official Business Settings
INSERT INTO public.business_settings (
    id,
    business_name,
    subtitle,
    tagline,
    quote,
    phone,
    phone_raw,
    whatsapp_url,
    instagram_url,
    maps_url,
    website_url,
    address_line1,
    address_line2,
    address_city,
    address_pincode,
    timings_weekdays
) VALUES (
    '00000000-0000-0000-0000-000000000002',
    'Tamil Designer Studio',
    'School of Fashion Design & Tailoring',
    'Wear Dreams, Not Just Clothes.',
    'Where Fabric Meets Imagination',
    '78452 64168',
    '917845264168',
    'https://wa.me/917845264168?text=Hello%20Tamil%20Designer%20Studio%2C%20I%20would%20like%20to%20know%20more%20about%20your%20tailoring%20classes%20and%20stitching%20services.',
    'https://instagram.com/tamil_designer_studio',
    'https://www.google.com/maps/place/11%C2%B003''18.8%22N+77%C2%B003''52.4%22E/@11.0552243,77.0619922,17z/data=!3m1!4b1!4m4!3m3!8m2!3d11.0552243!4d77.0645671?hl=en&entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D',
    '',
    '1/208 C, Jeeva Street',
    'Chinniyampalayam',
    'Coimbatore',
    '641062',
    'Weekdays: 9:00 AM – 1:00 PM & 3:00 PM – 8:00 PM'
) ON CONFLICT (id) DO NOTHING;

-- 3. Seed Services (Poster Stitching Services)
INSERT INTO public.services (title, description, icon_name, image_url, items, sort_order) VALUES
('Kids Pattu Lehenga Dress', 'Traditional Pattu Lehenga, Pavadai Sattai & ethnic girls outfits stitched to perfection for festivals and celebrations.', 'Star', '/services/kids_pattu_lehenga.jpg', '["Pattu Pavadai", "Langa Voni", "Lehenga Blouse", "Festive Frocks", "Half Saree Sets"]'::jsonb, 1),
('Traditional Indian Attires for Kids', 'Classic Indian ethnic wear for children — churidars, salwars, and traditional dresses stitched with care.', 'Sparkles', '/services/kids_traditional_attire.jpg', '["Churidar Sets", "Salwar Kameez", "Kurti & Pant", "Kid''s Ethnic Wear", "School Uniform Stitching"]'::jsonb, 2),
('Designer Gown & Anarkali Stitching', 'Stunning Anarkali suits, floor-length gowns, and designer party wear crafted with premium fabric.', 'Sparkles', '/services/designer_gown_anarkali.jpg', '["Anarkali Suits", "Long Gowns", "Maxi Variations", "Western Outfits", "Party Wear Gowns"]'::jsonb, 3),
('Bridal Blouse Designs', 'Exquisite bridal blouses with intricate hand work, silk and brocade fabric stitching for your most special day.', 'Heart', '/services/bridal_blouse_designs.jpg', '["Bridal Silk Blouse", "Wedding Blouse", "Embroidery Blouse", "Stone Work Blouse", "Zardosi Blouse"]'::jsonb, 4),
('Aari Works & Embroidery', 'Hand-crafted Aari embroidery work on blouses, dupattas, and garments with traditional patterns and modern elegance.', 'Sparkles', '/services/aari_embroidery_works.jpg', '["Aari Thread Work", "Zardosi Work", "Cutdana Work", "Mirror Work", "Maggam Embroidery"]'::jsonb, 5),
('Blouse & Lehenga Stitching', 'Blouse variations, lehenga skirts, and matching sets with perfect fitting across all fabric types.', 'Scissors', '/services/blouse_lehenga_stitching.jpg', '["Blouse Variations", "Lehenga Skirts", "Kurti Variations", "Pant Variations", "Nightwear"]'::jsonb, 6),
('Anarkali & Gown Stitching', 'Elegant Anarkali and gown stitching with fine-tuned draping, lining, and precision finishing.', 'Sparkles', '/services/anarkali_gown_stitching.jpg', '["Anarkali Stitching", "Long Gown", "Cape Gown", "Palazzo Suits", "Sharara Sets"]'::jsonb, 7),
('Trendy & Stylish Blouse Designs', 'Contemporary and trendy blouse designs — backless, collar neck, off-shoulder, and latest pattern blouses.', 'Shirt', '/services/trendy_stylish_blouse.jpg', '["Designer Blouse", "Collar Neck", "Puff Sleeve", "Off-Shoulder", "Backless Blouse"]'::jsonb, 8),
('Prepleating Services', 'Professional saree prepleating, expert draping, precision pinning, ironing, box & hanger folding, and buffy pleats.', 'Scissors', '/services/saree_draping.jpg', '["Saree Draping", "Saree Prepleating", "Pinig Techniques", "Ironing Method", "Box Folding", "Hanger Folding", "Buffy Pleats"]'::jsonb, 9)
ON CONFLICT DO NOTHING;

-- 4. Seed Courses (Official Academy Syllabus)
INSERT INTO public.courses (id, title, level, badge, description, topics, sort_order) VALUES
('c1', 'Blouse Variations', 'Advanced', '18 Variations', 'Master 18 bespoke designer blouse patterns — from royal princess cuts and Sabyasachi styles to modern halter and tube blouses.', '["Body analysis", "Armhole princess blouse", "Sleeveless princess blouse", "Halter neck blouse", "Tube blouse", "Boat neck blouse", "Shawl collar blouse", "Half Chinese collar blouse", "Princess cut with waist band", "One dart blouse", "Illusion neck blouse", "3 Dart blouse", "4 Dart blouse", "Madhubala blouse", "Katori blouse", "Sabyasachi blouse", "Blouse layout", "Elastic attachment blouse"]'::jsonb, 1),
('c2', 'Kurti Variations', 'Intermediate', '12 Variations', 'Learn pattern drafting and stitching for 12 trending kurti styles, collars, asymmetric hemlines, and comfort fits.', '["Straight kurti", "Packed neck kurti", "Side knot kurti", "Deep neck kurti", "Deep neck sleeveless kurti", "A-line kurti", "Flat collar kurti", "Shirt collar kurti", "Princess cut kurti", "High-low kurti", "Angrakha kurti", "Plus size kurti"]'::jsonb, 2),
('c3', 'Pant Variations', 'Intermediate', '7 Variations', 'Master 7 bottom-wear styles including tailored cigarette pants, palazzo flare, and ethnic salwars with comfortable waistband finishes.', '["Palazzo pants", "Cigarette pants", "High waist pants", "Patiala pants", "Salwar pants", "Jeans", "Leggings"]'::jsonb, 3),
('c4', 'Maxi Variations', 'Advanced', '11 Variations', 'Create floor-length maxi dresses, circular flares, tiered panels, and stunning saree-to-gown upcycling creations.', '["Full circular maxi", "Double circular maxi", "Half circular maxi", "Shoulder princess pleated maxi", "Gathered over coat maxi", "Pleated maxi", "3 Tiered maxi", "Full panel maxi", "Yoke panel maxi", "A-line maxi", "Saree to gown maxi"]'::jsonb, 4),
('c5', 'Full Set & Ethnic Ensembles', 'Specialized', 'Complete Sets', 'Craft matching festive wear ensembles, royal Madhubala co-ords, and trending sharara suits with precision draping.', '["Madhubala set", "2 Piece set", "Sharara"]'::jsonb, 5),
('c6', 'Western Outfits', 'Couture', '9 Outfits', 'Contemporary western fashion techniques — shirts, corsetry, jumpsuits, peplum, kaftan, and structural outerwear.', '["Women’s shirt", "Peplum top", "Kaftan", "Crop top", "One piece", "Corset", "Jumpsuit", "Shirred top", "Over coat"]'::jsonb, 6),
('c7', 'Saree Prepleating Class', 'Specialized', 'Signature Masterclass', 'Professional saree draping, precision pleating, pinning, ironing, box & hanger folding, and boutique packaging techniques.', '["Saree draping", "Saree prepleating", "Pinning techniques", "Ironing method", "Box folding", "Hanger folding", "Buffy pleats"]'::jsonb, 7)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  level = EXCLUDED.level,
  badge = EXCLUDED.badge,
  description = EXCLUDED.description,
  topics = EXCLUDED.topics,
  sort_order = EXCLUDED.sort_order;
