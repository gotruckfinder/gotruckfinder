-- Sanitation truck classification and optional video URL.
-- Apply once to the formal truck-finder-db database before deploying the Worker.
ALTER TABLE vehicles ADD COLUMN sub_category TEXT;
ALTER TABLE vehicles ADD COLUMN video_url TEXT;

CREATE INDEX IF NOT EXISTS idx_vehicles_category_sub_category
ON vehicles(category, sub_category);
