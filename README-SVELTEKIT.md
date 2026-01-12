# ChristFocus - Technical Documentation

A Christ-centered blog platform created by Robert Ngemanyi Kabangu using modern web technologies. Features an elegant black/white/gold design with interactive components.

## 🏗️ Tech Stack

- **SvelteKit 2.0.0** - Full-stack framework with SSR and file-based routing
- **TypeScript** - Type-safe development
- **Supabase 2.51.0** - PostgreSQL database, authentication, and storage
- **Tailwind CSS** - Custom utility-first styling with theme
- **Svelte Stores** - Reactive state management (authStore)
- **Lucide Svelte** - Beautiful icon library

## 📂 Project Structure

```
src/
├── lib/
│   ├── components/      # Svelte components
│   ├── services/        # API and business logic
│   ├── stores/          # State management
│   └── types.ts         # TypeScript interfaces
├── routes/              # SvelteKit pages
│   ├── +page.svelte     # Home page
│   ├── admin/           # Admin dashboard
│   ├── login/           # Authentication
│   └── post/[id]/       # Dynamic post pages
└── app.css              # Global styles
```

## ⚙️ Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Start development**
   ```bash
   npm run dev
   ```

## 🔐 Authentication

Authentication uses Supabase OTP (One-Time Password) flow:
- Email-based login
- Whitelist-protected registration
- Secure admin routes

## 🗄️ Database

Supabase PostgreSQL with tables:
- `posts` - Blog content
- `categories` - Post categories
- `tags` - Post tags
- `series` - Post series

## 📱 Routes

- `/` - Home page with posts
- `/about` - About page
- `/contact` - Contact information
- `/login` - Admin authentication
- `/post/[id]` - Individual posts
- `/admin` - Dashboard (protected)
- `/admin/write` - Create posts (protected)

## 🎨 Styling

- Tailwind CSS for utilities
- Custom CSS variables for theming
- Typography plugin for content
- Responsive design

## 📄 License

All rights reserved © Robert

- **Before**: `useAuth()` hook
- **After**: `authStore` writable store with derived stores

### Data Fetching
- **Before**: React Query hooks
- **After**: `onMount()` lifecycle with async/await

### Protected Routes
- **Before**: `<ProtectedRoute>` wrapper component
- **After**: Admin layout with auth check and redirect

## 🔐 Authentication

Authentication is restricted to whitelisted emails (see `AUTHORIZED_EMAILS` in [authService.ts](src/lib/services/authService.ts)). The login flow uses Supabase OTP:

1. User enters email
2. System sends OTP code
3. User verifies OTP and sets password
4. User can log in with email/password

## 🗄️ Database

The project uses Supabase PostgreSQL with the following main tables:
- `posts` - Blog posts with metadata
- `categories` - Post categories
- `tags` - Post tags
- `series` - Post series
- `post_categories` - Many-to-many relationship
- `post_tags` - Many-to-many relationship

## 🎨 Styling & Theme

ChristFocus uses a custom black/white/gold color scheme:

### Color Palette
- **Primary Gold**: `43 70% 45%` (muted gold for accents)
- **Background**: `0 0% 100%` (pure white)
- **Foreground**: `0 0% 0%` (pure black)
- **Custom Gold Shades**:
  - `--gold`: `#B8860B` (darker gold)
  - `--gold-dark`: `#8B6914` (darkest)
  - `--gold-light`: `#D4AF37` (lighter)

### Features
- **Tailwind CSS** with custom utility classes
- **CSS Variables** for theming in [app.css](src/app.css)
- **Typography Plugin** for rich text content
- **Responsive Design** for all screen sizes
- **Smooth Animations** with Svelte transitions (slide, quintOut easing)

## 📱 Pages

- `/` - Home page with hero image, welcome section, and posts
- `/about` - **Interactive About page** with expandable cards (Mission & Author)
- `/contact` - Contact information with author details
- `/login` - Admin login with OTP authentication
- `/post/[id]` - Individual post page with full content
- `/admin` - Admin dashboard with post management (protected)
- `/admin/write` - Create new post with rich editor (protected)
- `/admin/edit/[id]` - Edit existing post (protected)

### Interactive Features

The About page features:
- **Expandable Cards**: Click to reveal/hide content
- **Smooth Transitions**: Svelte slide animations (400ms)
- **Rotating Icons**: ChevronDown icons that rotate on expand
- **Hover Effects**: Border color changes and shadow increases
- **Responsive Design**: Works beautifully on all devices

## ✅ Completed Features

- [x] Black/white/gold color theme
- [x] Interactive About page with expandable cards
- [x] Professional header with navigation
- [x] Elegant footer with Bible verse
- [x] Hero section with full-screen image
- [x] Welcome section on homepage
- [x] Post cards with hover effects
- [x] Admin dashboard with styled table
- [x] Contact page with author information
- [x] Responsive design across all pages

## 🚧 Future Enhancements

- [ ] Advanced search with filters
- [ ] Category/tag/series filtering on homepage
- [ ] Image upload for featured images
- [ ] Post scheduling for future publication
- [ ] Pagination for large post collections
- [ ] Comments system
- [ ] Social sharing buttons
- [ ] Reading time estimates
- [ ] Related posts suggestions

## 📄 License

All rights reserved © Robert Ngemanyi Kabangu, 2026

## 🙏 Credits

Built with faith and dedication using SvelteKit, TypeScript, and Supabase.

**Author**: Robert Ngemanyi Kabangu  
**Email**: ngemanyir@gmail.com  
**Location**: Kigali, Rwanda

---

*"The Lord sets the captives free." - Psalm 146:7*
