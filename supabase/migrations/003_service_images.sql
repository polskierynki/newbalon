-- ============================================================
-- 003_service_images.sql
-- Migracja zdjęć usług na format JSON array + policies dla Storage
-- ============================================================

-- 1. Migracja starych kluczy service_photo_N → service_photos_N (JSON array)
--    Uruchamia się tylko jeśli nowy format jeszcze nie istnieje dla danego klucza
DO $$
DECLARE
  i INTEGER;
  old_val TEXT;
BEGIN
  FOR i IN 1..8 LOOP
    -- pobierz stary format (pojedynczy URL)
    SELECT value INTO old_val
    FROM content
    WHERE key = 'service_photo_' || i;

    IF old_val IS NOT NULL AND old_val <> '' THEN
      -- wstaw/zaktualizuj nowy format tylko jeśli nowy klucz jest pusty lub nie istnieje
      INSERT INTO content (key, value, updated_at)
      VALUES (
        'service_photos_' || i,
        json_build_array(old_val)::text,
        now()
      )
      ON CONFLICT (key) DO UPDATE
        SET value = EXCLUDED.value,
            updated_at = now()
        WHERE content.value = '[]' OR content.value = '';
    END IF;
  END LOOP;
END;
$$;

-- 2. Usuń stare klucze service_photo_N (opcjonalnie – odkomentuj gdy gotowy)
-- DELETE FROM content WHERE key ~ '^service_photo_[0-9]+$' AND key NOT LIKE 'service_photos_%';

-- ============================================================
-- Storage: bucket service-images
-- ============================================================

-- 3. Upewnij się że bucket istnieje jako publiczny
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Policy: publiczny odczyt (wszyscy mogą wyświetlać zdjęcia)
DROP POLICY IF EXISTS "service-images public read" ON storage.objects;
CREATE POLICY "service-images public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'service-images');

-- 5. Policy: upload tylko dla zalogowanych (admini)
DROP POLICY IF EXISTS "service-images authenticated upload" ON storage.objects;
CREATE POLICY "service-images authenticated upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'service-images');

-- 6. Policy: usuwanie tylko dla zalogowanych
DROP POLICY IF EXISTS "service-images authenticated delete" ON storage.objects;
CREATE POLICY "service-images authenticated delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'service-images');

-- 7. Policy: update tylko dla zalogowanych
DROP POLICY IF EXISTS "service-images authenticated update" ON storage.objects;
CREATE POLICY "service-images authenticated update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'service-images');
