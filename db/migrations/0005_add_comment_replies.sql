-- Migration: Add parent_id column to comments table for nested replies
BEGIN;

-- Add parent_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'comments' 
                   AND column_name = 'parent_id') THEN
        ALTER TABLE public.comments ADD COLUMN parent_id uuid REFERENCES comments(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
    END IF;
END $$;

COMMIT;
