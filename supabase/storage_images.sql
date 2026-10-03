-- Run this once in the Supabase SQL Editor for existing projects.
-- Creates the public bucket used by admin-uploaded service photos.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'studio-images',
    'studio-images',
    TRUE,
    10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
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
