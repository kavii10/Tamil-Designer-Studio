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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon_name VARCHAR(100) DEFAULT 'Sparkles',
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

-- 3. Seed Services
INSERT INTO public.services (title, description, icon_name, sort_order) VALUES
('Custom Stitching', 'Bespoke tailoring crafted to your precise measurements, personal aesthetics, and comfort.', 'Scissors', 1),
('Alterations', 'Flawless precision alterations, reshaping, sizing adjustments, and garment restoration.', 'Wrench', 2),
('Designer Wear', 'Exclusive handcrafted gowns, luxury party wear, ethnic ensembles, and modern couture.', 'Sparkles', 3),
('Bridal Stitching', 'Opulent bridal blouses, intricate hand aari embroidery, and bespoke wedding couture.', 'Heart', 4),
('Women’s Wear', 'Everyday chic to festive kurtis, salwars, anarkalis, lehengas, and designer outfits.', 'Shirt', 5)
ON CONFLICT DO NOTHING;

-- 4. Seed Courses
INSERT INTO public.courses (title, level, badge, description, topics, sort_order) VALUES
('Beginner Level', 'Beginner', 'Foundations', 'Master sewing machines, fundamental stitch mechanics, hand tools, and beginner garment assembly.', '["Machine Basics", "Basic Stitching", "Tools Knowledge", "Simple Garments"]'::jsonb, 1),
('Intermediate Level', 'Intermediate', 'Core Skills', 'Learn accurate body measurements, precise pattern drafting, women’s wear creation, and fitting techniques.', '["Pattern Drafting", "Women’s Wear Stitching", "Fitting Techniques"]'::jsonb, 2),
('Advanced Level', 'Advanced', 'Couture Mastery', 'Design high-end designer garments, bridal masterpieces, and acquire business growth mastery.', '["Designer Garments", "Bridal Stitching", "Boutique Business Training", "Marketing Strategy", "Social Media Marketing"]'::jsonb, 3),
('Saree Prepleting Class', 'Specialized', 'Signature Masterclass', 'Professional saree draping, precision pleating, pinning, ironing, and boutique packaging techniques.', '["Saree draping", "Saree prepleting", "Pinig techniques", "Iorning medhod", "Box folding", "Hanger folding", "Buffy pleats"]'::jsonb, 4),
('Boutique Business Training', 'Entrepreneurship', 'Career Accelerator', 'End-to-end guidance to launch, price, brand, and scale your independent boutique and tailoring studio.', '["Client Consultation & Fitting", "Costing & Profit Margins", "Social Media & Growth Marketing", "Fabric Sourcing & Vendor Networks"]'::jsonb, 5)
ON CONFLICT DO NOTHING;
