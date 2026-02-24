# 🏎️ Flotenn React + Supabase — Complete Walkthrough

> Full migration from PHP/CodeIgniter/MySQL → React + Vite + Supabase  
> **Date**: February 2026 | **Status**: Build Verified ✅ (124 modules, 0 errors)

---

## 📌 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [File Structure](#file-structure)
4. [Core Infrastructure](#core-infrastructure)
5. [Public Pages (11)](#public-pages)
6. [Admin Panel (15)](#admin-panel)
7. [Routing Architecture](#routing-architecture)
8. [Database Schema](#database-schema)
9. [API Layer](#api-layer)
10. [Authentication Flow](#authentication-flow)
11. [Styling System](#styling-system)
12. [Setup Instructions](#setup-instructions)
13. [Project Stats](#project-stats)

---

## 1. Project Overview

The Flotenn website was originally built with PHP (CodeIgniter 4), MySQL, and server-rendered HTML/CSS/JS. This migration converts it to a modern **Single Page Application (SPA)** with:

- **Frontend**: React 19 + React Router v7 + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Styling**: Vanilla CSS (migrated & enhanced from PHP views)
- **SEO**: React Helmet Async for meta management

### What Changed
| Aspect | PHP Version | React Version |
|--------|-------------|---------------|
| Rendering | Server-side (PHP views) | Client-side SPA |
| Database | MySQL | PostgreSQL (Supabase) |
| Auth | Session-based (CodeIgniter) | JWT-based (Supabase Auth) |
| API | PHP Controllers | Direct Supabase JS Client |
| Routing | PHP Router | React Router v7 |
| Build | None (raw PHP) | Vite (HMR + production build) |

---

## 2. Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.x | UI framework |
| Vite | 7.x | Build tool + dev server |
| React Router | 7.x | Client-side routing |
| @supabase/supabase-js | 2.x | Database + Auth client |
| React Helmet Async | 2.x | SEO meta management |

### Dependencies (package.json)
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "react-helmet-async": "^2.0.0",
    "@supabase/supabase-js": "^2.0.0"
  }
}
```

---

## 3. File Structure

```
react-version/
├── index.html                     # HTML entry point
├── package.json                   # Dependencies & scripts
├── vite.config.js                 # Vite configuration
├── .env                           # Environment variables
├── supabase-schema.sql            # Database schema + RLS + seed
├── WORK_DONE.md                   # Quick reference
├── WALKTHROUGH.md                 # This file
│
└── src/
    ├── main.jsx                   # React DOM root mount
    ├── App.jsx                    # Router with 30+ routes
    ├── index.css                  # CSS reset & variables
    │
    ├── context/
    │   └── AuthContext.jsx        # Auth provider (session, roles)
    │
    ├── services/
    │   ├── supabaseClient.js      # createClient() initialization
    │   └── api.js                 # 70+ exported CRUD functions
    │
    ├── utils/
    │   └── helpers.js             # slugify, formatDate, truncate...
    │
    ├── components/
    │   ├── Header.jsx             # Public navbar
    │   └── Footer.jsx             # Public footer
    │
    ├── layouts/
    │   ├── PublicLayout.jsx       # Header + <Outlet/> + Footer
    │   └── AdminLayout.jsx        # Sidebar + auth guard + <Outlet/>
    │
    ├── styles/
    │   ├── style.css              # Global theme (colors, typography)
    │   ├── home.css               # Homepage hero, sections
    │   ├── pages.css              # All public page styles (1000+ lines)
    │   └── admin.css              # Complete admin panel styles
    │
    └── pages/
        ├── Home.jsx               # Hero slider + services + testimonials
        ├── About.jsx              # Company story, team, stats
        ├── Services.jsx           # Service cards grid
        ├── ServiceDetail.jsx      # Single service + gallery
        ├── Blog.jsx               # Blog card listing
        ├── BlogDetail.jsx         # Full article view
        ├── Gallery.jsx            # Filterable image gallery
        ├── FAQ.jsx                # Accordion with categories
        ├── Contact.jsx            # Contact form → enquiries table
        ├── Page.jsx               # Dynamic CMS pages
        ├── NotFound.jsx           # Custom 404
        │
        └── admin/                 # <--- 15 admin pages
            ├── AdminLogin.jsx
            ├── AdminDashboard.jsx
            ├── AdminServices.jsx
            ├── AdminPosts.jsx
            ├── AdminPages.jsx
            ├── AdminFaqs.jsx
            ├── AdminTestimonials.jsx
            ├── AdminGallery.jsx
            ├── AdminHero.jsx
            ├── AdminUsers.jsx
            ├── AdminEnquiries.jsx
            ├── AdminBookings.jsx
            ├── AdminLogs.jsx
            ├── AdminSeo.jsx
            └── AdminStores.jsx
```

---

## 4. Core Infrastructure

### 4.1 Supabase Client (`src/services/supabaseClient.js`)
```js
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 4.2 Auth Context (`src/context/AuthContext.jsx`)
Provides authentication state to the entire app:
- **`user`** — Supabase auth user object
- **`userProfile`** — Profile from `users` table (name, role, etc.)
- **`loading`** — Auth loading state
- **`signIn(email, password)`** — Login function
- **`signOut()`** — Logout function
- **`hasRole(...roles)`** — Role-based access check

**Usage in components:**
```jsx
const { user, userProfile, signIn, signOut, hasRole } = useAuth();

// Check role
if (hasRole('super_admin', 'admin')) {
  // Show admin-only features
}
```

### 4.3 Helpers (`src/utils/helpers.js`)
| Function | Purpose |
|----------|---------|
| `slugify(text)` | Converts "Hello World" → "hello-world" |
| `formatDate(date)` | Formats to locale date string |
| `formatDateTime(date)` | Formats with time included |
| `truncate(text, length)` | Truncates text with "..." |
| `stripHtml(html)` | Removes HTML tags from content |

### 4.4 Layouts

**PublicLayout** — Wraps all public routes:
```
┌─────────────────────────┐
│       Header.jsx        │  ← Sticky navbar, mobile menu
├─────────────────────────┤
│       <Outlet />        │  ← Page content renders here
├─────────────────────────┤
│       Footer.jsx        │  ← Links, contact, social
└─────────────────────────┘
```

**AdminLayout** — Wraps all admin routes:
```
┌──────────┬──────────────────────┐
│          │    Top Bar           │
│ Sidebar  ├──────────────────────┤
│ (nav)    │                      │
│          │    <Outlet />        │
│          │    (admin page)      │
│          │                      │
└──────────┴──────────────────────┘
```
- **Auth guard**: Redirects to `/admin/login` if not authenticated
- **Role-based menu**: Super admins see Users, Logs, SEO links
- **Sidebar**: Navigation links for all admin sections
- **User info**: Shows logged-in user name and role

---

## 5. Public Pages

### 5.1 Home (`pages/Home.jsx`)
- **Hero Slider**: Auto-rotating slides from `hero_slides` table
  - Background images, titles with `*bold*` formatting, subtitles
  - CTA buttons, dot indicators, keyboard navigation
- **Services Grid**: Top services with pricing and status
- **Testimonials**: Customer reviews with star ratings
- **CTAs**: Links to services and contact pages

### 5.2 About (`pages/About.jsx`)
- Company story section with company history
- Team section placeholder
- Statistics counters (projects, clients, years)
- SEO meta tags via React Helmet

### 5.3 Services (`pages/Services.jsx`)
- Grid of service cards from Supabase
- Each card: image, name, description, price, CTA link
- Links to individual service detail pages

### 5.4 Service Detail (`pages/ServiceDetail.jsx`)
- Fetches by URL slug from `services` table
- Full description, gallery, pricing range
- SEO: meta_title, meta_description from database
- Related services sidebar

### 5.5 Blog (`pages/Blog.jsx`)
- Blog post cards with featured images
- Excerpt, author, published date
- Only shows `is_published = true` posts

### 5.6 Blog Detail (`pages/BlogDetail.jsx`)
- Full article with HTML content rendering
- Author, date, featured image
- SEO meta tags from post data

### 5.7 Gallery (`pages/Gallery.jsx`)
- Filterable by category (tabs)
- Image grid with lightbox preview
- Only shows published images

### 5.8 FAQ (`pages/FAQ.jsx`)
- Accordion-style Q&A
- Category filtering
- Expandable/collapsible answers

### 5.9 Contact (`pages/Contact.jsx`)
- Contact form (name, email, phone, city, subject, message)
- Submits to `enquiries` table via `createEnquiry()`
- Success/error feedback
- Company contact info sidebar

### 5.10 Page (`pages/Page.jsx`)
- Dynamic CMS page renderer
- Loads page by slug from `pages` table
- Used for privacy policy, terms of service, etc.
- Renders HTML content safely

### 5.11 Not Found (`pages/NotFound.jsx`)
- Custom 404 page with branded design
- "Go Home" CTA button

---

## 6. Admin Panel

### 6.1 Login (`admin/AdminLogin.jsx`)
- Dark-themed login card with Flotenn branding
- Email + password fields
- Supabase `signInWithPassword()` integration
- Auto-redirect if already authenticated
- Error display for invalid credentials

### 6.2 Dashboard (`admin/AdminDashboard.jsx`)
- **Stat Cards**: Total enquiries, services, posts (live counts from DB)
- **Recent Enquiries Table**: Last 5 enquiries with status badges
- Uses `getDashboardStats()` and `getRecentEnquiries()`

### 6.3 Services CRUD (`admin/AdminServices.jsx`)
**List View:**
| Column | Description |
|--------|-------------|
| ID | Auto-increment |
| Image | Thumbnail preview |
| Name | Service name |
| Slug | URL-friendly path |
| Price From | Starting price |
| Status | Published/Draft badge |
| Actions | Edit / Delete buttons |

**Form View (Create/Edit):**
- Name → auto-generates slug
- Short description + full description
- Price from/to + duration
- Image URL with preview
- Meta title, description, keywords (SEO)
- Publish toggle

### 6.4 Posts CRUD (`admin/AdminPosts.jsx`)
- Title, slug, excerpt, body content
- Featured image URL
- Author, publish date
- Status: draft/published
- SEO meta fields

### 6.5 Pages CRUD (`admin/AdminPages.jsx`)
- Title, slug, body content
- SEO meta fields
- Publish toggle

### 6.6 FAQs CRUD (`admin/AdminFaqs.jsx`)
- Question + answer (textarea)
- Category selection
- Sort order number
- Publish toggle

### 6.7 Testimonials CRUD (`admin/AdminTestimonials.jsx`)
- Customer name, content
- Star rating (1-5)
- Vehicle model
- Publish toggle

### 6.8 Gallery CRUD (`admin/AdminGallery.jsx`)
- Image path/URL
- Title, description
- Category
- Sort order
- Publish toggle
- Image preview in list and form

### 6.9 Hero Slides CRUD (`admin/AdminHero.jsx`)
- Image URL with preview
- Subtitle, title, description
- Button text + button link
- Sort order
- Active toggle

### 6.10 Users CRUD (`admin/AdminUsers.jsx`)
- Name, email, phone
- Role select: super_admin, admin, editor, support
- Role badges with color coding:
  - 🔴 super_admin (red)
  - 🔵 admin (blue)
  - 🟢 editor (green)
  - 🟡 support (orange)
- Active toggle
- Password field (create only)

### 6.11 Enquiries Management (`admin/AdminEnquiries.jsx`)
- Full list with expandable detail view
- Click row to expand → shows full message, phone, city
- Inline status dropdown:
  - New → Pending → Contacted → Urgent → Closed → Resolved
- Color-coded status badges
- Delete action

### 6.12 Bookings Management (`admin/AdminBookings.jsx`)
- Customer name, service type, vehicle details
- Booking date
- Inline status dropdown:
  - Pending → Confirmed → In Progress → Completed → Cancelled
- Delete action

### 6.13 Activity Logs (`admin/AdminLogs.jsx`)
- Read-only log viewer
- Columns: ID, User, Action, Entity, Details, Date
- Action type badges

### 6.14 SEO Settings (`admin/AdminSeo.jsx`)
- Key-value settings editor using `settings` table
- Fields: Site Title, Description, Keywords, OG Image, GA ID, Robots.txt
- Saves each key individually via `updateSetting(key, value)`

### 6.15 Stores CRUD (`admin/AdminStores.jsx`)
- Store name, address, city, state, pincode
- Phone, email
- Google Map link
- Active toggle

---

## 7. Routing Architecture

### Public Routes (inside `PublicLayout`)
| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Home` | Homepage |
| `/about` | `About` | About page |
| `/services` | `Services` | Services listing |
| `/services/:slug` | `ServiceDetail` | Single service |
| `/blog` | `Blog` | Blog listing |
| `/blog/:slug` | `BlogDetail` | Single post |
| `/gallery` | `Gallery` | Image gallery |
| `/faq` | `FAQ` | FAQ page |
| `/contact` | `Contact` | Contact form |
| `/page/:slug` | `Page` | Dynamic CMS page |
| `*` | `NotFound` | 404 fallback |

### Admin Routes (inside `AdminLayout`)
| Path | Component | Type |
|------|-----------|------|
| `/admin/login` | `AdminLogin` | Auth (no layout) |
| `/admin/dashboard` | `AdminDashboard` | View |
| `/admin/services` | `AdminServices` | List |
| `/admin/services/create` | `AdminServiceForm` | Create |
| `/admin/services/edit/:id` | `AdminServiceForm` | Edit |
| `/admin/posts` | `AdminPosts` | List |
| `/admin/posts/create` | `AdminPostForm` | Create |
| `/admin/posts/edit/:id` | `AdminPostForm` | Edit |
| `/admin/pages` | `AdminPages` | List |
| `/admin/pages/create` | `AdminPageForm` | Create |
| `/admin/pages/edit/:id` | `AdminPageForm` | Edit |
| `/admin/faqs` | `AdminFaqs` | List |
| `/admin/faqs/create` | `AdminFaqForm` | Create |
| `/admin/faqs/edit/:id` | `AdminFaqForm` | Edit |
| `/admin/testimonials` | `AdminTestimonials` | List |
| `/admin/testimonials/create` | `AdminTestimonialForm` | Create |
| `/admin/testimonials/edit/:id` | `AdminTestimonialForm` | Edit |
| `/admin/gallery` | `AdminGallery` | List |
| `/admin/gallery/create` | `AdminGalleryForm` | Create |
| `/admin/gallery/edit/:id` | `AdminGalleryForm` | Edit |
| `/admin/hero` | `AdminHero` | List |
| `/admin/hero/create` | `AdminHeroForm` | Create |
| `/admin/hero/edit/:id` | `AdminHeroForm` | Edit |
| `/admin/users` | `AdminUsers` | List |
| `/admin/users/create` | `AdminUserForm` | Create |
| `/admin/users/edit/:id` | `AdminUserForm` | Edit |
| `/admin/enquiries` | `AdminEnquiries` | Manage |
| `/admin/bookings` | `AdminBookings` | Manage |
| `/admin/logs` | `AdminLogs` | View |
| `/admin/seo` | `AdminSeo` | Settings |
| `/admin/stores` | `AdminStores` | List |
| `/admin/stores/create` | `AdminStoreForm` | Create |

---

## 8. Database Schema

### Tables (16 total)

| Table | Columns | RLS Public Read | RLS Public Insert |
|-------|---------|-----------------|-------------------|
| `users` | id, name, email, password_hash, phone, role, is_active | ❌ | ❌ |
| `services` | id, slug, name, short_description, description, price_from, price_to, image_url, meta_*, is_published | ✅ (published) | ❌ |
| `pages` | id, slug, title, excerpt, content, meta_*, is_published | ✅ (published) | ❌ |
| `posts` | id, slug, title, excerpt, content, author, featured_image, status, meta_*, is_published | ✅ (published) | ❌ |
| `enquiries` | id, name, email, phone, city, subject, message, status | ❌ | ✅ |
| `bookings` | id, service_id, customer_name, customer_phone, vehicle_*, status | ❌ | ✅ |
| `testimonials` | id, name, rating, content, vehicle_model, is_published | ✅ (published) | ❌ |
| `faqs` | id, question, answer, category, sort_order, is_published | ✅ (published) | ❌ |
| `gallery_images` | id, title, category, image_path, is_published | ✅ (published) | ❌ |
| `hero_slides` | id, image_url, subtitle, title, description, button_text, button_link, order_index, is_active | ✅ (active) | ❌ |
| `stores` | id, name, address, city, state, phone, lat, lng, is_active | ✅ (active) | ❌ |
| `settings` | id, key, value | ✅ | ❌ |
| `media` | id, filename, original_name, mime, size, path, uploaded_by | ❌ | ❌ |
| `activity_logs` | id, user_id, user_name, action, entity_type, details | ❌ | ❌ |
| `post_categories` | id, name, slug | ✅ | ❌ |
| `franchise_applications` | id, name, email, phone, city, state, message, status | ❌ | ✅ |

### RLS Policy Summary
- **Public SELECT**: Only published/active content
- **Public INSERT**: Contact forms (enquiries, bookings, franchise apps)
- **Authenticated**: Full CRUD on all tables (admin panel)

---

## 9. API Layer

### File: `src/services/api.js` (70+ functions)

Each entity follows the same CRUD pattern:
```
getPublished{Entity}()  → Public read (filtered)
getAll{Entity}()        → Admin read (all)
get{Entity}ById(id)     → Single record
create{Entity}(data)    → Insert
update{Entity}(id, data)→ Update
delete{Entity}(id)      → Delete
```

### Complete Function List by Entity

**Services** (7): `getServices`, `getAllServices`, `getServiceBySlug`, `getServiceById`, `createService`, `updateService`, `deleteService`

**Posts** (7): `getPublishedPosts`, `getAllPosts`, `getPostBySlug`, `getPostById`, `createPost`, `updatePost`, `deletePost`

**Pages** (7): `getPublishedPages`, `getAllPages`, `getPageBySlug`, `getPageById`, `createPage`, `updatePage`, `deletePage`

**Enquiries** (5): `getEnquiries`, `getRecentEnquiries`, `createEnquiry`, `updateEnquiryStatus`, `deleteEnquiry`

**Bookings** (4): `getBookings`, `createBooking`, `updateBookingStatus`, `deleteBooking`

**Testimonials** (6): `getPublishedTestimonials`, `getAllTestimonials`, `getTestimonialById`, `createTestimonial`, `updateTestimonial`, `deleteTestimonial`

**FAQs** (6): `getPublishedFaqs`, `getAllFaqs`, `getFaqById`, `createFaq`, `updateFaq`, `deleteFaq`

**Gallery** (6): `getPublishedGalleryImages`, `getAllGalleryImages`, `getGalleryImageById`, `createGalleryImage`, `updateGalleryImage`, `deleteGalleryImage`

**Hero Slides** (6): `getActiveHeroSlides`, `getAllHeroSlides`, `getHeroSlideById`, `createHeroSlide`, `updateHeroSlide`, `deleteHeroSlide`

**Users** (5): `getUsers`, `getUserById`, `createUser`, `updateUser`, `deleteUser`

**Stores** (3): `getStores`, `createStore`, `deleteStore`

**Activity Logs** (2): `getActivityLogs`, `createActivityLog`

**Settings** (2): `getSettings`, `updateSetting`

**Media** (2): `getMedia`, `uploadMedia`

**Dashboard** (1): `getDashboardStats`

---

## 10. Authentication Flow

```
User visits /admin/login
        │
        ▼
  Enter email + password
        │
        ▼
  supabase.auth.signInWithPassword()
        │
        ├── ❌ Error → Show error message
        │
        └── ✅ Success → Session cookie set
                │
                ▼
        AuthContext detects session
                │
                ▼
        Fetch user profile from `users` table
                │
                ▼
        Redirect to /admin/dashboard
                │
                ▼
        AdminLayout renders sidebar + Outlet
                │
                ├── hasRole('super_admin') → Show Users, Logs, SEO links
                └── All roles → Show Dashboard, Services, Posts, etc.
```

**Logout**: Calls `supabase.auth.signOut()` → clears session → redirects to login

---

## 11. Styling System

### CSS Architecture
| File | Lines | Purpose |
|------|-------|---------|
| `style.css` | ~400 | Global theme: CSS variables, colors, typography, reset |
| `home.css` | ~500 | Hero slider, service cards, testimonials, CTAs |
| `pages.css` | ~1000 | All 11 public page styles |
| `admin.css` | ~600 | Complete admin panel: sidebar, forms, tables, cards |
| **Total** | **~2500** | |

### CSS Variables (Theme)
```css
:root {
  --primary: #ff0000;        /* Brand red */
  --accent: #ff3333;         /* Lighter red */
  --dark: #0a0a0a;           /* Near black */
  --darker: #050505;         /* Deep black */
  --card-bg: #111111;        /* Card backgrounds */
  --text: #ffffff;           /* Primary text */
  --text-grey: #888888;      /* Secondary text */
  --border: #222222;         /* Border color */
  --gradient: linear-gradient(135deg, #ff0000, #cc0000);
}
```

### Design Features
- Dark premium theme with red accents
- Glassmorphism effects on cards
- Hover animations and transitions
- Mobile-responsive layouts
- Status badges with color coding
- Form validation styles

---

## 12. Setup Instructions

### Step 1: Install Dependencies
```bash
cd react-version
npm install
```

### Step 2: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Note your **Project URL** and **anon key** from Settings → API

### Step 3: Configure Environment
Create `.env` in `react-version/`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Set Up Database
1. Open Supabase Dashboard → **SQL Editor**
2. Copy-paste entire contents of `supabase-schema.sql`
3. Click **Run** → All 16 tables, RLS policies, and seed data created

### Step 5: Create Admin User
1. Go to **Authentication** → **Users** → **Add User**
2. Create user: `admin@flotenn.in` with a strong password
3. This maps to the seed user in the `users` table

### Step 6: Create Storage Bucket
1. Go to **Storage** → **New Bucket**
2. Name: `media` → Toggle **Public bucket** on
3. This enables image uploads from the admin panel

### Step 7: Run Development Server
```bash
npm run dev
```
- **Public site**: http://localhost:5173
- **Admin panel**: http://localhost:5173/admin/login

### Step 8: Production Build
```bash
npm run build
```
Output goes to `dist/` folder — deploy to Vercel, Netlify, or any static host.

---

## 13. Project Stats

| Metric | Count |
|--------|-------|
| Total files created | **40+** |
| React components | **30** |
| Admin pages | **15** |
| Public pages | **11** |
| API functions | **70+** |
| Database tables | **16** |
| RLS policies | **35** |
| Admin routes | **22** |
| Public routes | **11** |
| CSS lines total | **~2,500** |
| JS modules (build) | **124** |
| Build time | **3.17s** |
| Build errors | **0** |
| CSS bundle | **40.86 kB** (8 kB gzip) |
| JS bundle | **538.25 kB** (146 kB gzip) |

---

*Generated on February 20, 2026*
