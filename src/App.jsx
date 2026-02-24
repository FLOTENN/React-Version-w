import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// ===== Public Pages =====
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Gallery from './pages/Gallery';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Page from './pages/Page';
import NotFound from './pages/NotFound';

// ===== Admin Pages =====
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { AdminServices, AdminServiceForm } from './pages/admin/AdminServices';
import { AdminPosts, AdminPostForm } from './pages/admin/AdminPosts';
import { AdminPages, AdminPageForm } from './pages/admin/AdminPages';
import { AdminFaqs, AdminFaqForm } from './pages/admin/AdminFaqs';
import { AdminTestimonials, AdminTestimonialForm } from './pages/admin/AdminTestimonials';
import { AdminGallery, AdminGalleryForm } from './pages/admin/AdminGallery';
import { AdminHero, AdminHeroForm } from './pages/admin/AdminHero';
import { AdminUsers, AdminUserForm } from './pages/admin/AdminUsers';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminLogs from './pages/admin/AdminLogs';
import AdminSeo from './pages/admin/AdminSeo';
import AdminBookings from './pages/admin/AdminBookings';
import { AdminStores, AdminStoreForm } from './pages/admin/AdminStores';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
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
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
