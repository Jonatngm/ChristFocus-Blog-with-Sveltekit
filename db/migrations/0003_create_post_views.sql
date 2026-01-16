-- Migration: Create post_views table and RPC to increment unique views for anonymous visitors only
BEGIN;

-- Create table to store unique views per post from anonymous browsers only
CREATE TABLE IF NOT EXISTS public.post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  anon_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add anon_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'post_views' 
                   AND column_name = 'anon_id') THEN
        ALTER TABLE public.post_views ADD COLUMN anon_id text NOT NULL;
    END IF;
END $$;

-- Drop old indexes if they exist
DROP INDEX IF EXISTS public.uniq_post_user;
DROP INDEX IF EXISTS public.uniq_post_anon;
DROP INDEX IF EXISTS public.uniq_post_email;

-- Create unique index to ensure one view per anonymous browser per post
CREATE UNIQUE INDEX IF NOT EXISTS uniq_post_anon ON public.post_views(post_id, anon_id);

-- Remove user_email column if it exists (logged-in users are no longer tracked)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' 
               AND table_name = 'post_views' 
               AND column_name = 'user_email') THEN
        ALTER TABLE public.post_views DROP COLUMN user_email;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' 
               AND table_name = 'post_views' 
               AND column_name = 'user_id') THEN
        ALTER TABLE public.post_views DROP COLUMN user_id;
    END IF;
END $$;

-- Drop old function (all possible signatures and parameter orders)
DROP FUNCTION IF EXISTS public.increment_unique_view(uuid, uuid, text);
DROP FUNCTION IF EXISTS public.increment_unique_view(uuid, text);
DROP FUNCTION IF EXISTS public.increment_unique_view(uuid, text, text);
DROP FUNCTION IF EXISTS public.increment_unique_view(text, uuid);

-- Function to insert a unique view for anonymous visitors only and increment posts.views atomically
-- Parameters: p_post_id (uuid), p_anon_id (text)
CREATE OR REPLACE FUNCTION public.increment_unique_view(p_post_id uuid, p_anon_id text)
RETURNS json AS $$
DECLARE
  inserted integer;
  updated_post json;
BEGIN
  -- Only track views for anonymous users by browser ID
  -- Logged-in users are completely excluded from view counting
  IF p_anon_id IS NOT NULL THEN
    INSERT INTO public.post_views(post_id, anon_id)
    VALUES (p_post_id, p_anon_id)
    ON CONFLICT (post_id, anon_id) DO NOTHING;
    GET DIAGNOSTICS inserted = ROW_COUNT;
    
    -- Only increment if a new row was inserted (first time this browser viewed this post)
    IF inserted > 0 THEN
      UPDATE posts SET views = COALESCE(views, 0) + 1 WHERE id = p_post_id;
    END IF;
  END IF;

  -- Return the updated post as JSON
  SELECT row_to_json(posts.*) INTO updated_post
  FROM posts 
  WHERE id = p_post_id;
  
  RETURN updated_post;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to anonymous users only (authenticated users don't need to call this)
GRANT EXECUTE ON FUNCTION public.increment_unique_view(uuid, text) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_unique_view(uuid, text) TO authenticated;

COMMIT;
