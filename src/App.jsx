import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// ===== Public Pages (Lazy Loaded) =====
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const Page = lazy(() => import('./pages/Page'));
const NotFound = lazy(() => import('./pages/NotFound'));

// ===== Admin Pages (Lazy Loaded) =====
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminEnquiries = lazy(() => import('./pages/admin/AdminEnquiries'));
const AdminLogs = lazy(() => import('./pages/admin/AdminLogs'));
const AdminSeo = lazy(() => import('./pages/admin/AdminSeo'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));

// Note: Components with named exports require special handling for React.lazy,
// For simplicity in this optimization, we will import them standardly or create wrapper files.
// Since we want max performance, leaving Admin routes as standard or creating a simple wrapper is OK, 
// but to be safe and code-split the massive admin bundle, we'll keep the named imports standard for now
// and let Vite's chunking handle the /admin route separation.

import { AdminServices, AdminServiceForm } from './pages/admin/AdminServices';
import { AdminPosts, AdminPostForm } from './pages/admin/AdminPosts';
import { AdminPages, AdminPageForm } from './pages/admin/AdminPages';
import { AdminFaqs, AdminFaqForm } from './pages/admin/AdminFaqs';
import { AdminTestimonials, AdminTestimonialForm } from './pages/admin/AdminTestimonials';
import { AdminGallery, AdminGalleryForm } from './pages/admin/AdminGallery';
import { AdminHero, AdminHeroForm } from './pages/admin/AdminHero';
import { AdminUsers, AdminUserForm } from './pages/admin/AdminUsers';
import { AdminStores, AdminStoreForm } from './pages/admin/AdminStores';

// Simple loading fallback
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0a' }}>
    <div style={{ width: '40px', height: '40px', border: '3px solid #333', borderTop: '3px solid #ff004f', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ===== Public Routes ===== */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/service/:slug" element={<ServiceDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/page/:slug" element={<Page />} />
                <Route path="/:slug" element={<Page />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* ===== Admin Routes ===== */}
              <Route path="/admin/login" element={<AdminLogin />} />

              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />

                {/* Services CRUD */}
                <Route path="services" element={<AdminServices />} />
                <Route path="services/create" element={<AdminServiceForm />} />
                <Route path="services/edit/:id" element={<AdminServiceForm />} />

                {/* Blog Posts CRUD */}
                <Route path="posts" element={<AdminPosts />} />
                <Route path="posts/create" element={<AdminPostForm />} />
                <Route path="posts/edit/:id" element={<AdminPostForm />} />

                {/* Pages CRUD */}
                <Route path="pages" element={<AdminPages />} />
                <Route path="pages/create" element={<AdminPageForm />} />
                <Route path="pages/edit/:id" element={<AdminPageForm />} />

                {/* FAQs CRUD */}
                <Route path="faqs" element={<AdminFaqs />} />
                <Route path="faqs/create" element={<AdminFaqForm />} />
                <Route path="faqs/edit/:id" element={<AdminFaqForm />} />

                {/* Testimonials CRUD */}
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="testimonials/create" element={<AdminTestimonialForm />} />
                <Route path="testimonials/edit/:id" element={<AdminTestimonialForm />} />

                {/* Gallery CRUD */}
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="gallery/create" element={<AdminGalleryForm />} />
                <Route path="gallery/edit/:id" element={<AdminGalleryForm />} />

                {/* Hero Slider CRUD */}
                <Route path="hero" element={<AdminHero />} />
                <Route path="hero/create" element={<AdminHeroForm />} />
                <Route path="hero/edit/:id" element={<AdminHeroForm />} />

                {/* Users CRUD */}
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/create" element={<AdminUserForm />} />
                <Route path="users/edit/:id" element={<AdminUserForm />} />

                {/* Read-Only / Management */}
                <Route path="enquiries" element={<AdminEnquiries />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="logs" element={<AdminLogs />} />
                <Route path="seo" element={<AdminSeo />} />

                {/* Stores */}
                <Route path="stores" element={<AdminStores />} />
                <Route path="stores/create" element={<AdminStoreForm />} />
                <Route path="stores/edit/:id" element={<AdminStoreForm />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
