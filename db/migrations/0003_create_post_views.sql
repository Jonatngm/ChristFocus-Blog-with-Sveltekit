-- Migration: Create post_views table and RPC to increment unique views based on user email
BEGIN;

-- Create table to store unique views per post and per user email
CREATE TABLE IF NOT EXISTS public.post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NULL,
  user_email text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add user_email column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'post_views' 
                   AND column_name = 'user_email') THEN
        ALTER TABLE public.post_views ADD COLUMN user_email text;
    END IF;
END $$;

-- Drop old indexes if they exist
DROP INDEX IF EXISTS public.uniq_post_user;
DROP INDEX IF EXISTS public.uniq_post_anon;

-- Create unique index to ensure one view per email per post
CREATE UNIQUE INDEX IF NOT EXISTS uniq_post_email ON public.post_views(post_id, user_email) WHERE user_email IS NOT NULL;

-- Drop old function
DROP FUNCTION IF EXISTS public.increment_unique_view(uuid, uuid, text);

-- Function to insert a unique view based on user email and increment posts.views atomically
CREATE OR REPLACE FUNCTION public.increment_unique_view(p_post_id uuid, p_user_email text DEFAULT NULL)
RETURNS posts AS $$
DECLARE
  inserted integer;
BEGIN
  -- Only track views for logged-in users with email
  IF p_user_email IS NOT NULL THEN
    INSERT INTO public.post_views(post_id, user_email)
    VALUES (p_post_id, p_user_email)
    ON CONFLICT (post_id, user_email) WHERE user_email IS NOT NULL DO NOTHING;
    GET DIAGNOSTICS inserted = ROW_COUNT;
    
    -- Only increment if a new row was inserted
    IF inserted > 0 THEN
      UPDATE posts SET views = COALESCE(views, 0) + 1 WHERE id = p_post_id;
    END IF;
  END IF;

  RETURN (SELECT * FROM posts WHERE id = p_post_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.increment_unique_view(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_unique_view(uuid, text) TO anon;

COMMIT;
