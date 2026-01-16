-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published post comments
CREATE POLICY "Anyone can view comments" ON comments
    FOR SELECT
    USING (true);

-- Policy: Authenticated users can insert their own comments
CREATE POLICY "Authenticated users can insert comments" ON comments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own comments
CREATE POLICY "Users can update own comments" ON comments
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own comments
CREATE POLICY "Users can delete own comments" ON comments
    FOR DELETE
    USING (auth.uid() = user_id);

-- Function to get comments with user info
CREATE OR REPLACE FUNCTION get_post_comments(post_uuid UUID)
RETURNS TABLE (
    id UUID,
    post_id UUID,
    user_id UUID,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    user_email TEXT
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
        c.content,
        c.created_at,
        c.updated_at,
        COALESCE(u.email, 'Anonymous') as user_email
    FROM comments c
    LEFT JOIN auth.users u ON c.user_id = u.id
    WHERE c.post_id = post_uuid
    ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION get_post_comments(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_post_comments(UUID) TO anon;
