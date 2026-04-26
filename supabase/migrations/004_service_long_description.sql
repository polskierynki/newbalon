-- ============================================================
-- 004_service_long_description.sql
-- Dodaje kolumnę long_description do tabeli services
-- ============================================================

ALTER TABLE services
  ADD COLUMN IF NOT EXISTS long_description TEXT NOT NULL DEFAULT '';
