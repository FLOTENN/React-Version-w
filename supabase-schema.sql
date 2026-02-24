-- =====================================================
-- Flotenn / Brotomotiv — Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor (supabase.com/dashboard)
-- =====================================================

-- ==================== USERS ====================
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL DEFAULT '',
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'editor'
        CHECK (role IN ('super_admin', 'admin', 'editor', 'support', 'viewer')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== SERVICES ====================
CREATE TABLE IF NOT EXISTS public.services (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    short_description TEXT,
    description TEXT,
    price_from DECIMAL(10,2),
    price_to DECIMAL(10,2),
    duration_minutes INTEGER,
    image_url VARCHAR(500),
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== PAGES ====================
CREATE TABLE IF NOT EXISTS public.pages (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== POSTS (Blog) ====================
CREATE TABLE IF NOT EXISTS public.posts (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT,
    author VARCHAR(255),
    author_id BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
    featured_image VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published')),
    is_published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== ENQUIRIES ====================
CREATE TABLE IF NOT EXISTS public.enquiries (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    city VARCHAR(100),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'pending', 'contacted', 'urgent', 'closed', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== BOOKINGS ====================
CREATE TABLE IF NOT EXISTS public.bookings (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT REFERENCES public.services(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_details TEXT,
    service_type VARCHAR(255),
    booking_date TIMESTAMPTZ,
    preferred_date TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== TESTIMONIALS ====================
CREATE TABLE IF NOT EXISTS public.testimonials (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    content TEXT NOT NULL,
    vehicle_model VARCHAR(255),
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== FAQs ====================
CREATE TABLE IF NOT EXISTS public.faqs (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== GALLERY IMAGES ====================
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    category VARCHAR(100),
    image_path VARCHAR(500) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== HERO SLIDES ====================
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id BIGSERIAL PRIMARY KEY,
    image_url VARCHAR(500),
    subtitle VARCHAR(255),
    title VARCHAR(255),
    description TEXT,
    button_text VARCHAR(255),
    button_link VARCHAR(500),
    cta_text VARCHAR(255),
    cta_link VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== STORES ====================
CREATE TABLE IF NOT EXISTS public.stores (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    phone VARCHAR(50),
    email VARCHAR(255),
    google_map_link TEXT,
    lat DECIMAL(10,7),
    lng DECIMAL(10,7),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== SETTINGS ====================
CREATE TABLE IF NOT EXISTS public.settings (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL UNIQUE,
    value TEXT
);

-- ==================== MEDIA ====================
CREATE TABLE IF NOT EXISTS public.media (
    id BIGSERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    mime VARCHAR(100),
    size INTEGER,
    path VARCHAR(500) NOT NULL,
    uploaded_by BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== ACTIVITY LOGS ====================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    details TEXT,
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== POST CATEGORIES ====================
CREATE TABLE IF NOT EXISTS public.post_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== FRANCHISE APPLICATIONS ====================
CREATE TABLE IF NOT EXISTS public.franchise_applications (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'reviewed', 'contacted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== PASSWORD RESETS ====================
CREATE TABLE IF NOT EXISTS public.password_resets (
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_password_resets_email ON public.password_resets(email);


-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;

-- ===== PUBLIC READ policies (published content only) =====
CREATE POLICY "Public can read published services"
    ON public.services FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read published pages"
    ON public.pages FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read published posts"
    ON public.posts FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read published testimonials"
    ON public.testimonials FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read published faqs"
    ON public.faqs FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read published gallery images"
    ON public.gallery_images FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read active hero slides"
    ON public.hero_slides FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active stores"
    ON public.stores FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read settings"
    ON public.settings FOR SELECT USING (true);

CREATE POLICY "Public can read post categories"
    ON public.post_categories FOR SELECT USING (true);

-- ===== PUBLIC INSERT policies (contact forms) =====
CREATE POLICY "Public can submit enquiries"
    ON public.enquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can submit bookings"
    ON public.bookings FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can submit franchise applications"
    ON public.franchise_applications FOR INSERT WITH CHECK (true);

-- ===== AUTHENTICATED (admin) FULL ACCESS =====
-- These policies give full CRUD to authenticated (logged-in) users

CREATE POLICY "Admins full access to users"
    ON public.users FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to services"
    ON public.services FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to pages"
    ON public.pages FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to posts"
    ON public.posts FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to enquiries"
    ON public.enquiries FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to bookings"
    ON public.bookings FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to testimonials"
    ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to faqs"
    ON public.faqs FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to gallery images"
    ON public.gallery_images FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to hero slides"
    ON public.hero_slides FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to stores"
    ON public.stores FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to settings"
    ON public.settings FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to media"
    ON public.media FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to activity logs"
    ON public.activity_logs FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to post categories"
    ON public.post_categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to franchise applications"
    ON public.franchise_applications FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins full access to password resets"
    ON public.password_resets FOR ALL USING (auth.role() = 'authenticated');


-- =====================================================
-- SEED DATA
-- =====================================================

-- Default admin user (create via Supabase Auth dashboard, then insert profile here)
-- Email: admin@flotenn.in | Password: set in Supabase Auth
INSERT INTO public.users (name, email, password_hash, role, is_active) VALUES
    ('Admin', 'admin@flotenn.in', '', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;

-- Sample services
INSERT INTO public.services (slug, name, short_description, price_from, is_published) VALUES
    ('ceramic-coating', 'Ceramic Coating', 'Premium 9H ceramic coating for long-lasting protection and mirror-like shine.', 15000.00, true),
    ('ppf', 'Paint Protection Film', 'Ultimate self-healing PPF defense against scratches, chips and UV damage.', 55000.00, true),
    ('detailing', 'Detailing', 'Deep cleaning, paint correction and interior restoration for a showroom finish.', 5000.00, true),
    ('window-tinting', 'Window Tinting', 'Premium heat-rejecting window tints for comfort and UV protection.', 3000.00, true),
    ('body-wraps', 'Body Wraps', 'Custom vinyl wraps in matte, gloss, satin and specialty finishes.', 25000.00, true),
    ('interior-coating', 'Interior Coating', 'Premium leather and trim protection with anti-stain nano coating.', 8000.00, true)
ON CONFLICT (slug) DO NOTHING;

-- Sample hero slides
INSERT INTO public.hero_slides (subtitle, title, description, button_text, button_link, image_url, order_index, is_active) VALUES
    ('WELCOME TO FLOTENN', 'Premium *Auto* Care\nExperience', 'Where precision meets passion. India''s premier automotive detailing destination.', 'Explore Services', '/services', 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1920', 0, true),
    ('PAINT PROTECTION', 'Shield Your *Vehicle*\nWith PPF', 'Self-healing paint protection film that guards against scratches and rock chips.', 'Learn More', '/services/ppf', 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=1920', 1, true),
    ('CERAMIC COATING', 'Ultimate *Ceramic*\nProtection', '9H ceramic coating for unmatched gloss, hydrophobic protection, and UV defense.', 'Get Quote', '/contact', 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1920', 2, true)
ON CONFLICT DO NOTHING;

-- Sample testimonials
INSERT INTO public.testimonials (name, rating, content, vehicle_model, is_published) VALUES
    ('Rajesh Kumar', 5, 'Absolutely stunning ceramic coating! My BMW looks like it just rolled off the showroom floor. The team at Flotenn is incredibly professional.', 'BMW 3 Series', true),
    ('Priya Sharma', 5, 'Got PPF done on my new Mercedes and the quality is outstanding. Highly recommend Flotenn for premium car care.', 'Mercedes C-Class', true),
    ('Aditya Patel', 5, 'The interior detailing was phenomenal. Every inch of my Audi was spotless. Will definitely come back!', 'Audi Q5', true)
ON CONFLICT DO NOTHING;

-- Sample FAQs
INSERT INTO public.faqs (question, answer, category, sort_order, is_published) VALUES
    ('What is Ceramic Coating?', 'Ceramic coating is a liquid polymer that chemically bonds with your vehicle''s factory paint, creating a layer of protection. It provides a long-lasting shine and makes the surface hydrophobic.', 'Ceramic Coating', 1, true),
    ('How long does Ceramic Coating last?', 'Our premium 9H ceramic coating lasts 3-5 years with proper maintenance. We recommend using pH-neutral car shampoo for washing.', 'Ceramic Coating', 2, true),
    ('What is Paint Protection Film (PPF)?', 'PPF is a thermoplastic urethane film applied to painted surfaces to protect from stone chips, bug splatters, and minor abrasions. Our PPF is self-healing — minor scratches disappear with heat.', 'PPF', 3, true),
    ('How long does PPF installation take?', 'Full body PPF typically takes 3-5 days depending on the vehicle. Partial installations (front bumper, hood, fenders) can be completed in 1-2 days.', 'PPF', 4, true),
    ('Do you offer pickup and delivery?', 'Yes, we offer complimentary pickup and delivery within the city for services above ₹10,000.', 'General', 5, true),
    ('What payment methods do you accept?', 'We accept UPI, credit/debit cards, net banking, and cash. EMI options are available for services above ₹25,000.', 'General', 6, true)
ON CONFLICT DO NOTHING;

-- Sample pages
INSERT INTO public.pages (slug, title, content, is_published) VALUES
    ('privacy-policy', 'Privacy Policy', '<h2>Privacy Policy</h2><p>At Flotenn, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information when you use our services or visit our website.</p><h3>Information We Collect</h3><p>We collect information you provide directly to us, such as your name, email, phone number, and vehicle details when you book a service or submit an enquiry.</p><h3>How We Use Your Information</h3><p>Your information is used to process your bookings, respond to enquiries, send service updates, and improve our services.</p><h3>Data Protection</h3><p>We implement industry-standard security measures to protect your data from unauthorized access or disclosure.</p>', true),
    ('terms-of-service', 'Terms of Service', '<h2>Terms of Service</h2><p>By using Flotenn''s services, you agree to the following terms and conditions.</p><h3>Services</h3><p>All services are subject to availability and vehicle inspection. Pricing may vary based on vehicle size and condition.</p><h3>Warranty</h3><p>Ceramic coating comes with a 3-year warranty. PPF installations carry a manufacturer warranty of up to 10 years against yellowing and peeling.</p><h3>Cancellation</h3><p>Cancellations must be made at least 24 hours before the scheduled appointment. Late cancellations may incur a 10% fee.</p>', true)
ON CONFLICT (slug) DO NOTHING;

-- Default SEO settings
INSERT INTO public.settings (key, value) VALUES
    ('site_title', 'Flotenn - Premium Auto Care & Detailing'),
    ('site_description', 'India''s premier automotive detailing destination. Ceramic coating, PPF, detailing, and body wraps.'),
    ('site_keywords', 'ceramic coating, PPF, paint protection film, car detailing, auto care, India'),
    ('og_image', ''),
    ('google_analytics_id', ''),
    ('robots_txt', 'User-agent: *\nAllow: /')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- DONE! Schema + RLS + Seed data applied successfully.
-- 
-- NEXT STEP: Create an admin user in Supabase Auth:
-- 1. Go to Authentication > Users in Supabase Dashboard
-- 2. Click "Add User" and create: admin@flotenn.in
-- 3. The users table row above maps to this auth user
-- =====================================================
