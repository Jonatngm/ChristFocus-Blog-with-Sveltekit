-- Migration: Add comment likes functionality
BEGIN;

-- Add likes_count column to comments table
ALTER TABLE public.comments 
ADD COLUMN IF NOT EXISTS likes_count integer DEFAULT 0 NOT NULL;

-- Create comment_likes table to track individual likes
CREATE TABLE IF NOT EXISTS public.comment_likes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id uuid NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id text,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT comment_likes_unique UNIQUE (comment_id, user_id, session_id)
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON public.comment_likes(user_id);

-- RPC function to toggle like on a comment
CREATE OR REPLACE FUNCTION public.toggle_comment_like(
    p_comment_id uuid,
    p_user_id uuid DEFAULT NULL,
    p_session_id text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_existing_like uuid;
    v_new_count integer;
    v_action text;
BEGIN
    -- Check if like already exists
    SELECT id INTO v_existing_like
    FROM public.comment_likes
    WHERE comment_id = p_comment_id
        AND (
            (p_user_id IS NOT NULL AND user_id = p_user_id)
            OR (p_session_id IS NOT NULL AND session_id = p_session_id)P
        );
    
    IF v_existing_like IS NOT NULL THEN
        -- Unlike: Remove the like
        DELETE FROM public.comment_likes WHERE id = v_existing_like;
        
        -- Decrement likes_count
        UPDATE public.comments
        SET likes_count = GREATEST(0, likes_count - 1)
        WHERE id = p_comment_id
        RETURNING likes_count INTO v_new_count;
        
        v_action := 'unliked';
    ELSE
        -- Like: Add the like
        INSERT INTO public.comment_likes (comment_id, user_id, session_id)
        VALUES (p_comment_id, p_user_id, p_session_id);
        
        -- Increment likes_count
        UPDATE public.comments
        SET likes_count = likes_count + 1
        WHERE id = p_comment_id
        RETURNING likes_count INTO v_new_count;
        
        v_action := 'liked';
    END IF;
    
    RETURN json_build_object(
        'action', v_action,
        'likes_count', v_new_count
    );
END;
$$;

-- RPC function to check if user has liked a comment
CREATE OR REPLACE FUNCTION public.get_comment_likes_status(
    p_comment_ids uuid[],
    p_user_id uuid DEFAULT NULL,
    p_session_id text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result json;
BEGIN
    SELECT json_object_agg(comment_id, true)
    INTO v_result
    FROM public.comment_likes
    WHERE comment_id = ANY(p_comment_ids)
        AND (
            (p_user_id IS NOT NULL AND user_id = p_user_id)
            OR (p_session_id IS NOT NULL AND session_id = p_session_id)
        );
    
    RETURN COALESCE(v_result, '{}'::json);
END;
$$;

COMMIT;
