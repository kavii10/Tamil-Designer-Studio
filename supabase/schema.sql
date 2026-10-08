-- ==============================================================================
-- TAMIL DESIGNER STUDIO — Complete Fresh Schema
-- Run this in Supabase SQL Editor (you already deleted the old tables)
-- Creates all tables with correct columns. NO service data seeded.
-- After running: Go to Admin → Stitching Services → Save All Services
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. QR CODES ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.qr_codes (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    destination_url TEXT NOT NULL,
    is_active   BOOLEAN DEFAULT TRUE,
    scan_count  BIGINT DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. BUSINESS SETTINGS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.business_settings (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name       VARCHAR(255) NOT NULL DEFAULT 'Tamil Designer Studio',
    business_name_ta    VARCHAR(255) DEFAULT 'Tamil Designer Studio',
    subtitle            VARCHAR(255) NOT NULL DEFAULT 'School of Fashion Design & Tailoring',
    subtitle_ta         VARCHAR(255) DEFAULT 'ஃபேஷன் டிசைன் & தையல் பள்ளி',
    tagline             VARCHAR(255) NOT NULL DEFAULT 'Wear Dreams, Not Just Clothes.',
    tagline_ta          VARCHAR(255) DEFAULT 'கனவுகளை அணியுங்கள், வெறும் ஆடைகளை அல்ல.',
    quote               VARCHAR(255) NOT NULL DEFAULT 'Where Fabric Meets Imagination',
    quote_ta            VARCHAR(255) DEFAULT 'துணி கற்பனையுடன் சந்திக்கும் இடம்',
    phone               VARCHAR(50)  NOT NULL DEFAULT '78452 64168',
    phone_raw           VARCHAR(50)  NOT NULL DEFAULT '917845264168',
    whatsapp_url        TEXT NOT NULL DEFAULT 'https://wa.me/917845264168',
    instagram_url       TEXT NOT NULL DEFAULT 'https://instagram.com/tamil_designer_studio',
    maps_url            TEXT NOT NULL DEFAULT '',
    website_url         TEXT DEFAULT '',
    address_line1       VARCHAR(255) NOT NULL DEFAULT '1/208 C, Jeeva Street',
    address_line1_ta    VARCHAR(255) DEFAULT '1/208 C, ஜீவா தெரு',
    address_line2       VARCHAR(255) NOT NULL DEFAULT 'Chinniyampalayam',
    address_line2_ta    VARCHAR(255) DEFAULT 'சின்னியம்பாளையம்',
    address_city        VARCHAR(100) NOT NULL DEFAULT 'Coimbatore',
    address_city_ta     VARCHAR(100) DEFAULT 'கோயம்புத்தூர்',
    address_pincode     VARCHAR(20)  NOT NULL DEFAULT '641062',
    timings_weekdays    VARCHAR(255) NOT NULL DEFAULT 'Weekdays: 9:00 AM - 1:00 PM & 3:00 PM - 8:00 PM',
    timings_weekdays_ta VARCHAR(255) DEFAULT 'திங்கள் - சனி: காலை 9:00 - மதியம் 1:00 & மாலை 3:00 - இரவு 8:00',
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. SERVICES ──────────────────────────────────────────────────────────────
-- id is VARCHAR so admin can use s1, s2 ... s99 as stable keys for upsert
CREATE TABLE IF NOT EXISTS public.services (
    id             VARCHAR(255) PRIMARY KEY,
    title          VARCHAR(255) NOT NULL,
    title_ta       VARCHAR(255),
    description    TEXT,
    description_ta TEXT,
    icon_name      VARCHAR(100) DEFAULT 'Sparkles',
    image_url      TEXT,
    items          JSONB DEFAULT '[]'::jsonb,
    items_ta       JSONB DEFAULT '[]'::jsonb,
    is_active      BOOLEAN DEFAULT TRUE,
    sort_order     INT DEFAULT 0,
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. COURSES ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courses (
    id             VARCHAR(255) PRIMARY KEY,
    title          VARCHAR(255) NOT NULL,
    title_ta       VARCHAR(255),
    level          VARCHAR(100) NOT NULL DEFAULT 'Beginner',
    level_ta       VARCHAR(100),
    badge          VARCHAR(100),
    badge_ta       VARCHAR(100),
    description    TEXT,
    description_ta TEXT,
    topics         JSONB NOT NULL DEFAULT '[]'::jsonb,
    topics_ta      JSONB DEFAULT '[]'::jsonb,
    is_active      BOOLEAN DEFAULT TRUE,
    sort_order     INT DEFAULT 0,
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. SCAN LOGS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.scan_logs (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    qr_code_id   UUID REFERENCES public.qr_codes(id) ON DELETE CASCADE,
    scanned_at   TIMESTAMPTZ DEFAULT NOW(),
    device_type  VARCHAR(50),
    browser      VARCHAR(100),
    os           VARCHAR(100),
    user_agent   TEXT,
    referrer     TEXT,
    ip_hash      VARCHAR(64)
);

-- ── INDEXES ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_qr_codes_slug        ON public.qr_codes(slug);
CREATE INDEX IF NOT EXISTS idx_scan_logs_qr_id      ON public.scan_logs(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_scan_logs_scanned_at ON public.scan_logs(scanned_at);
CREATE INDEX IF NOT EXISTS idx_services_sort        ON public.services(sort_order);
CREATE INDEX IF NOT EXISTS idx_courses_sort         ON public.courses(sort_order);

-- ── AUTO UPDATE TIMESTAMP ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_qr_updated ON public.qr_codes;
CREATE TRIGGER trg_qr_updated BEFORE UPDATE ON public.qr_codes FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

DROP TRIGGER IF EXISTS trg_settings_updated ON public.business_settings;
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.business_settings FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- ── RLS POLICIES (allow full access for the app) ──────────────────────────────
ALTER TABLE public.qr_codes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_logs         ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_qr_codes"          ON public.qr_codes;
DROP POLICY IF EXISTS "allow_all_business_settings" ON public.business_settings;
DROP POLICY IF EXISTS "allow_all_courses"           ON public.courses;
DROP POLICY IF EXISTS "allow_all_services"          ON public.services;
DROP POLICY IF EXISTS "allow_all_scan_logs"         ON public.scan_logs;

CREATE POLICY "allow_all_qr_codes"          ON public.qr_codes          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_business_settings" ON public.business_settings  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_courses"           ON public.courses            FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_services"          ON public.services           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_scan_logs"         ON public.scan_logs          FOR ALL USING (true) WITH CHECK (true);

-- ── PUBLIC SERVICE IMAGE STORAGE ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'studio-images',
    'studio-images',
    TRUE,
    26214400,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read studio images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload studio images" ON storage.objects;
CREATE POLICY "Public read studio images" ON storage.objects
    FOR SELECT TO anon, authenticated USING (bucket_id = 'studio-images');
CREATE POLICY "Public upload studio images" ON storage.objects
    FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'studio-images');

-- ── SEED: QR CODE ─────────────────────────────────────────────────────────────
INSERT INTO public.qr_codes (id, name, slug, destination_url, is_active, scan_count)
VALUES ('00000000-0000-0000-0000-000000000001', 'Tamil Designer Studio — Visiting Card QR', 'tamil-designer-studio', '/tamil-designer-studio', TRUE, 0)
ON CONFLICT (slug) DO UPDATE SET destination_url = EXCLUDED.destination_url;

-- ── SEED: BUSINESS SETTINGS ───────────────────────────────────────────────────
INSERT INTO public.business_settings (id, business_name, subtitle, tagline, quote, phone, phone_raw, whatsapp_url, instagram_url, maps_url, website_url, address_line1, address_line2, address_city, address_pincode, timings_weekdays)
VALUES ('00000000-0000-0000-0000-000000000002', 'Tamil Designer Studio', 'School of Fashion Design & Tailoring', 'Wear Dreams, Not Just Clothes.', 'Where Fabric Meets Imagination', '78452 64168', '917845264168', 'https://wa.me/917845264168?text=Hello%20Tamil%20Designer%20Studio', 'https://instagram.com/tamil_designer_studio', '', '', '1/208 C, Jeeva Street', 'Chinniyampalayam', 'Coimbatore', '641062', 'Weekdays: 9:00 AM - 1:00 PM & 3:00 PM - 8:00 PM')
ON CONFLICT (id) DO NOTHING;

-- ── SEED: COURSES (syllabus) ──────────────────────────────────────────────────
INSERT INTO public.courses (id, title, level, badge, description, topics, is_active, sort_order) VALUES
('c1','Blouse Variations','Advanced','18 Variations','Master 18 bespoke designer blouse patterns.','["Body analysis","Armhole princess blouse","Sleeveless princess blouse","Halter neck blouse","Tube blouse","Boat neck blouse","Shawl collar blouse","Half Chinese collar blouse","Princess cut with waist band","One dart blouse","Illusion neck blouse","3 Dart blouse","4 Dart blouse","Madhubala blouse","Katori blouse","Sabyasachi blouse","Blouse layout","Elastic attachment blouse"]'::jsonb,TRUE,1),
('c2','Kurti Variations','Intermediate','12 Variations','Learn 12 trending kurti styles with pattern drafting and stitching.','["Straight kurti","Packed neck kurti","Side knot kurti","Deep neck kurti","Deep neck sleeveless kurti","A-line kurti","Flat collar kurti","Shirt collar kurti","Princess cut kurti","High-low kurti","Angrakha kurti","Plus size kurti"]'::jsonb,TRUE,2),
('c3','Pant Variations','Intermediate','7 Variations','Master 7 bottom-wear styles including palazzo, cigarette and salwar.','["Palazzo pants","Cigarette pants","High waist pants","Patiala pants","Salwar pants","Jeans","Leggings"]'::jsonb,TRUE,3),
('c4','Maxi Variations','Advanced','11 Variations','Create floor-length maxi dresses, circular flares and saree-to-gown styles.','["Full circular maxi","Double circular maxi","Half circular maxi","Shoulder princess pleated maxi","Gathered over coat maxi","Pleated maxi","3 Tiered maxi","Full panel maxi","Yoke panel maxi","A-line maxi","Saree to gown maxi"]'::jsonb,TRUE,4),
('c5','Full Set & Ethnic Ensembles','Specialized','Complete Sets','Craft matching festive wear ensembles and sharara suits.','["Madhubala set","2 Piece set","Sharara"]'::jsonb,TRUE,5),
('c6','Western Outfits','Couture','9 Outfits','Contemporary western fashion — shirts, corsets, jumpsuits and outerwear.','["Womens shirt","Peplum top","Kaftan","Crop top","One piece","Corset","Jumpsuit","Shirred top","Over coat"]'::jsonb,TRUE,6),
('c7','Saree Prepleating Class','Specialized','Signature Masterclass','Professional saree draping, pleating, pinning and boutique packaging.','["Saree draping","Saree prepleating","Pinning techniques","Ironing method","Box folding","Hanger folding","Buffy pleats"]'::jsonb,TRUE,7)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,level=EXCLUDED.level,badge=EXCLUDED.badge,description=EXCLUDED.description,topics=EXCLUDED.topics,is_active=EXCLUDED.is_active,sort_order=EXCLUDED.sort_order;

-- ── VERIFY: Check tables created ──────────────────────────────────────────────
SELECT table_name, (SELECT COUNT(*) FROM information_schema.columns WHERE table_name=t.table_name AND table_schema='public') AS column_count
FROM information_schema.tables t
WHERE table_schema='public' AND table_type='BASE TABLE'
ORDER BY table_name;
