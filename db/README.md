# Database Migrations

This directory contains SQL migrations for the ChristFocus blog database.

## Running Migrations

### Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the migration files in order:
   - `0000_ensure_views_column.sql` - Creates views column
   - `0001_increment_post_views.sql` - Creates simple increment function
   - `0002_create_post_views.sql` - Creates advanced unique view tracking

4. Click **Run** to execute each migration

### Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (get reference ID from dashboard)
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

### Using psql (Alternative)

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run each migration
\i migrations/0000_ensure_views_column.sql
\i migrations/0001_increment_post_views.sql
\i migrations/0002_create_post_views.sql
```

## Migration Files

- **0000_ensure_views_column.sql**: Ensures the `views` column exists in the posts table with a default value of 0
- **0001_increment_post_views.sql**: Creates a simple RPC function to increment post views atomically
- **0002_create_post_views.sql**: Creates the `post_views` table and advanced RPC function for unique view tracking per user/anonymous visitor

## Verifying Migrations

After running migrations, verify they worked:

```sql
-- Check if views column exists
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'posts' AND column_name = 'views';

-- Check if RPC functions exist
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('increment_post_views', 'increment_unique_view');

-- Check if post_views table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'post_views';
```

## Troubleshooting

If you get permission errors, make sure:
1. You're connected as the `postgres` user
2. The functions have proper grants (see migration files)
3. RLS policies allow the operations

If migrations fail:
1. Check Supabase logs in the dashboard
2. Verify your database connection
3. Run migrations in order (0000 → 0001 → 0002)
