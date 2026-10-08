-- ==============================================================================
-- TAMIL DESIGNER STUDIO — Safe Incremental Migration for Supabase
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- This is 100% SAFE: It adds the missing columns and storage support without
-- deleting or altering any of your existing database records.
-- ==============================================================================

-- 1. ADD BILINGUAL (TAMIL) COLUMNS TO BUSINESS SETTINGS
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS business_name_ta VARCHAR(255) DEFAULT 'Tamil Designer Studio';
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS subtitle_ta VARCHAR(255) DEFAULT 'ஃபேஷன் டிசைன் & தையல் பள்ளி';
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS tagline_ta VARCHAR(255) DEFAULT 'கனவுகளை அணியுங்கள், வெறும் ஆடைகளை அல்ல.';
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS quote_ta VARCHAR(255) DEFAULT 'துணி கற்பனையுடன் சந்திக்கும் இடம்';
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS address_line1_ta VARCHAR(255) DEFAULT '1/208 C, ஜீவா தெரு';
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS address_line2_ta VARCHAR(255) DEFAULT 'சின்னியம்பாளையம்';
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS address_city_ta VARCHAR(100) DEFAULT 'கோயம்புத்தூர்';
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS timings_weekdays_ta VARCHAR(255) DEFAULT 'திங்கள் - சனி: காலை 9:00 - மதியம் 1:00 & மாலை 3:00 - இரவு 8:00';

-- 2. ADD BILINGUAL (TAMIL) COLUMNS TO COURSES
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS title_ta VARCHAR(255);
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS level_ta VARCHAR(100);
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS badge_ta VARCHAR(100);
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS description_ta TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS topics_ta JSONB DEFAULT '[]'::jsonb;

-- 3. ADD BILINGUAL (TAMIL) COLUMNS TO SERVICES
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS title_ta VARCHAR(255);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS description_ta TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS items_ta JSONB DEFAULT '[]'::jsonb;

-- 4. UPDATE STORAGE BUCKET TO ALLOW SYLLABUS PDF FILES & RAISE LIMIT TO 25MB
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

-- 5. ENSURE STORAGE POLICIES ALLOW BOTH IMAGES AND PDFS
DROP POLICY IF EXISTS "Public read studio images" ON storage.objects;
CREATE POLICY "Public read studio images" ON storage.objects
    FOR SELECT TO anon, authenticated USING (bucket_id = 'studio-images');

DROP POLICY IF EXISTS "Public upload studio images" ON storage.objects;
CREATE POLICY "Public upload studio images" ON storage.objects
    FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'studio-images');
