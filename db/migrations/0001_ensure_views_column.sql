-- Migration: Ensure views column exists in posts table
-- This should be run first before other view-related migrations

BEGIN;

-- Add views column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'views'
  ) THEN
    ALTER TABLE posts ADD COLUMN views integer DEFAULT 0;
  END IF;
END $$;

-- Set default value for existing null views
UPDATE posts SET views = 0 WHERE views IS NULL;

-- Create index for better performance on view counts
CREATE INDEX IF NOT EXISTS idx_posts_views ON posts(views DESC);

COMMIT;
