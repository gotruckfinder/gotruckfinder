-- Truck Finder: add SEO metadata fields for dynamic D1 vehicle records.
-- Apply this migration to the DEVELOPMENT database first.
ALTER TABLE vehicles ADD COLUMN seo_title TEXT;
ALTER TABLE vehicles ADD COLUMN meta_description TEXT;
ALTER TABLE vehicles ADD COLUMN focus_keyword TEXT;
ALTER TABLE vehicles ADD COLUMN related_keywords TEXT;
ALTER TABLE vehicles ADD COLUMN image_alt TEXT;
