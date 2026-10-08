-- Run in Supabase SQL Editor to enable cloud-synced bilingual course stages.
CREATE TABLE IF NOT EXISTS public.course_stage_syllabuses (
    id             VARCHAR(32) PRIMARY KEY,
    stage_key      VARCHAR(32) NOT NULL,
    level          TEXT NOT NULL,
    level_ta       TEXT,
    title          TEXT NOT NULL,
    title_ta       TEXT,
    badge          TEXT NOT NULL,
    badge_ta       TEXT,
    duration       TEXT NOT NULL DEFAULT '',
    duration_ta    TEXT,
    description    TEXT NOT NULL DEFAULT '',
    description_ta TEXT,
    highlights     JSONB NOT NULL DEFAULT '[]'::jsonb,
    highlights_ta  JSONB DEFAULT '[]'::jsonb,
    pdf_url        TEXT,
    pdf_name       TEXT,
    pdf_size       TEXT,
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.course_stage_syllabuses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_course_stage_syllabuses"
    ON public.course_stage_syllabuses;
CREATE POLICY "allow_all_course_stage_syllabuses"
    ON public.course_stage_syllabuses
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) AND NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = 'course_stage_syllabuses'
    ) THEN
        ALTER PUBLICATION supabase_realtime
            ADD TABLE public.course_stage_syllabuses;
    END IF;
END;
$$;
