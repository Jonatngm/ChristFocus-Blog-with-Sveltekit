# Instagram-Style Like Functionality - Deployment Guide

## ✅ Changes Deployed (Commit 07394a9)

### Features Implemented:
1. **Persistent Like Storage** - Likes are saved to database
2. **Like Count Display** - Shows "X likes" on each comment (like Instagram)
3. **Real-time Updates** - Count updates instantly when liked/unliked
4. **User/Session Tracking** - Prevents duplicate likes from same user
5. **Like/Unlike Toggle** - Click to like, click again to unlike

### How It Works:
- **Logged-in users**: Likes tracked by user_id
- **Anonymous users**: Likes tracked by session_id (stored in browser)
- **Display**: Shows "1 like" or "5 likes" below timestamp
- **Unlike**: Button text changes from "Like" to "Unlike"
- **Persistence**: Likes survive page refreshes

## 🔧 Required: Run Migration in Supabase

### Migration File: `0006_add_comment_likes.sql`

Go to your **Supabase Dashboard** → **SQL Editor** and run:

```sql
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
            OR (p_session_id IS NOT NULL AND session_id = p_session_id)
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
```

### Verify Migration:
After running the migration, verify with:

```sql
-- Check likes_count column exists
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'comments' AND column_name = 'likes_count';

-- Check comment_likes table exists
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'comment_likes';

-- Check RPC functions exist
SELECT routine_name FROM information_schema.routines 
WHERE routine_name IN ('toggle_comment_like', 'get_comment_likes_status');
```

## 📊 Database Schema

### New Table: `comment_likes`
- `id` - UUID primary key
- `comment_id` - References comments(id)
- `user_id` - References auth.users(id) (for logged-in users)
- `session_id` - Text (for anonymous users)
- `created_at` - Timestamp
- **Unique constraint** on (comment_id, user_id, session_id)

### Updated Table: `comments`
- Added: `likes_count` integer (default 0)

## 🎯 Testing After Migration

1. Visit a blog post on your site
2. Try liking a comment (anonymous)
3. Refresh the page - like should persist
4. Click "Unlike" - count decrements
5. Like count should display: "1 like" or "5 likes"
6. Test with logged-in user
7. Test with multiple devices

## 🎨 UI Features

**Like Count Display:**
- Hidden when 0 likes
- Shows "1 like" (singular)
- Shows "5 likes" (plural)
- Appears between timestamp and Like button

**Like Button:**
- Text changes: "Like" ↔ "Unlike"
- Heart icon fills red when liked
- Updates instantly on click

**Instagram-Style:**
- Clean gray text for counts
- Matches Instagram's comment layout
- Responsive on all devices

## 🚀 Production Ready

✅ All code deployed to GitHub
✅ Vercel will auto-deploy
✅ Only migration needed in Supabase
✅ No breaking changes
✅ Backward compatible

Your like functionality is now fully implemented just like Instagram! 💖
