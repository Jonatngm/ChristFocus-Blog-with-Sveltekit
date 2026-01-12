# TheTruthHub - Technical Documentation

A Christocentric blog platform created by Robert using modern web technologies.

## 🏗️ Tech Stack

- **SvelteKit** - Full-stack framework with SSR
- **TypeScript** - Type-safe development
- **Supabase** - PostgreSQL database and authentication
- **Tailwind CSS** - Utility-first styling
- **Svelte Stores** - Reactive state management

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

## 🎨 Styling

- **Tailwind CSS** for utility classes
- **Custom theme** with CSS variables in [app.css](src/app.css)
- **Typography plugin** for rich text content
- **Dark mode support** via mode-watcher

## 📱 Pages

- `/` - Home page with featured and latest posts
- `/about` - About page
- `/contact` - Contact information
- `/login` - Admin login
- `/post/[id]` - Individual post page
- `/admin` - Admin dashboard (protected)
- `/admin/write` - Create new post (protected)
- `/admin/edit/[id]` - Edit post (protected)

## 🚧 TODO

- [ ] Complete TipTap rich text editor integration
- [ ] Implement search functionality
- [ ] Add category/tag/series filtering
- [ ] Complete admin edit post page
- [ ] Add image upload functionality
- [ ] Implement post scheduling
- [ ] Add pagination for posts
- [ ] Improve loading states
- [ ] Add error boundaries
- [ ] Complete UI components migration

## 📄 License

All rights reserved © Emmanuel Victor Mucyo

## 🙏 Credits

Built with love using SvelteKit, TypeScript, and Supabase.

*"I am the way, the truth, and the life" - John 14:6*
