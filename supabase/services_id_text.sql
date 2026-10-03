-- Run in the Supabase SQL Editor if service saves fail with a UUID/type error.
-- Converts legacy UUID service IDs to text while retaining existing service rows.

ALTER TABLE public.services
    ALTER COLUMN id DROP DEFAULT;

ALTER TABLE public.services
    ALTER COLUMN id TYPE VARCHAR(255) USING id::text;

-- Reuse legacy seeded rows for the stable IDs used by the admin instead of duplicating them.
UPDATE public.services AS service
SET id = 's' || service.sort_order::text
WHERE service.sort_order BETWEEN 1 AND 9
  AND service.id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND (
      SELECT COUNT(*)
      FROM public.services AS same_order
      WHERE same_order.sort_order = service.sort_order
  ) = 1
  AND NOT EXISTS (
      SELECT 1
      FROM public.services AS existing
      WHERE existing.id = 's' || service.sort_order::text
  );
