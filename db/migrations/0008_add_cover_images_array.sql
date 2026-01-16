-- Add cover_images column to support multiple cover images for posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_images TEXT[];

-- Create index for cover_images for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_cover_images ON posts USING GIN(cover_images);

-- Comment on the column
COMMENT ON COLUMN posts.cover_images IS 'Array of cover image URLs for carousel display on post detail page';
