-- Migration: Create initial database schema
-- Run this FIRST before any other migrations

BEGIN;

-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  featured boolean DEFAULT false,
  published boolean DEFAULT false,
  views integer DEFAULT 0,
  scheduled_for timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create series table
CREATE TABLE IF NOT EXISTS public.series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create post_categories junction table
CREATE TABLE IF NOT EXISTS public.post_categories (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Create post_tags junction table
CREATE TABLE IF NOT EXISTS public.post_tags (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Add series_id to posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS series_id uuid REFERENCES series(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_views ON posts(views DESC);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts (public read, authenticated write)
CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can insert posts" ON posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for categories (public read, authenticated write)
CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for tags (public read, authenticated write)
CREATE POLICY "Public can view tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage tags" ON tags
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for series (public read, authenticated write)
CREATE POLICY "Public can view series" ON series
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage series" ON series
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for junction tables (public read, authenticated write)
CREATE POLICY "Public can view post_categories" ON post_categories
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage post_categories" ON post_categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view post_tags" ON post_tags
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage post_tags" ON post_tags
  FOR ALL USING (auth.role() = 'authenticated');

COMMIT;
