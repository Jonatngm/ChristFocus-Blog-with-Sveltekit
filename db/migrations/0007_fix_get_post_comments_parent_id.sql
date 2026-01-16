-- Update get_post_comments function to include parent_id and likes_count
DROP FUNCTION IF EXISTS get_post_comments(UUID);

CREATE OR REPLACE FUNCTION get_post_comments(post_uuid UUID)
RETURNS TABLE (
    id UUID,
    post_id UUID,
    user_id UUID,
    author_name TEXT,
    author_email TEXT,
    content TEXT,
    session_id TEXT,
    parent_id UUID,
    likes_count INTEGER,
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
        c.parent_id,
        COALESCE(c.likes_count, 0)::INTEGER as likes_count,
        c.created_at,
        c.updated_at
    FROM comments c
    WHERE c.post_id = post_uuid
    ORDER BY c.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION get_post_comments(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_post_comments(UUID) TO anon;
