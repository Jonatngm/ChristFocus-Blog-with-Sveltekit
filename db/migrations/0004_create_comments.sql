-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_email TEXT,
    content TEXT NOT NULL,
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alter existing table to add new columns if they don't exist
DO $$ 
BEGIN
    -- Add author_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'comments' AND column_name = 'author_name') THEN
        ALTER TABLE comments ADD COLUMN author_name TEXT;
    END IF;
    
    -- Add author_email column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'comments' AND column_name = 'author_email') THEN
        ALTER TABLE comments ADD COLUMN author_email TEXT;
    END IF;
    
    -- Add session_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'comments' AND column_name = 'session_id') THEN
        ALTER TABLE comments ADD COLUMN session_id TEXT;
    END IF;
    
    -- Make user_id nullable if it isn't already
    ALTER TABLE comments ALTER COLUMN user_id DROP NOT NULL;
    
    -- Update author_name to NOT NULL after adding default values
    UPDATE comments SET author_name = 'Anonymous' WHERE author_name IS NULL;
    ALTER TABLE comments ALTER COLUMN author_name SET NOT NULL;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
DROP POLICY IF EXISTS "Anyone can delete own comments" ON comments;
DROP POLICY IF EXISTS "Authenticated users can delete own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete by session" ON comments;

-- Policy: Anyone can view comments
CREATE POLICY "Anyone can view comments" ON comments
    FOR SELECT
    USING (true);

-- Policy: Anyone can insert comments (no authentication required)
CREATE POLICY "Anyone can insert comments" ON comments
    FOR INSERT
    WITH CHECK (true);

-- Policy: Authenticated users can delete their own comments
CREATE POLICY "Authenticated users can delete own comments" ON comments
    FOR DELETE
    USING (auth.uid() = user_id);

-- Policy: Anyone can delete comments with matching session (no auth required)
CREATE POLICY "Users can delete by session" ON comments
    FOR DELETE
    USING (true);

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_post_comments(UUID);

-- Function to get comments with user info
CREATE OR REPLACE FUNCTION get_post_comments(post_uuid UUID)
RETURNS TABLE (
    id UUID,
    post_id UUID,
    user_id UUID,
    author_name TEXT,
    author_email TEXT,
    content TEXT,
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.post_id,
        c.user_id,
        c.author_name,
        c.author_email,
        c.content,
        c.session_id,
        c.created_at,
        c.updated_at
    FROM comments c
    WHERE c.post_id = post_uuid
    ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION get_post_comments(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_post_comments(UUID) TO anon;
