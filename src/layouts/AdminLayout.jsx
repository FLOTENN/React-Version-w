import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

export default function AdminLayout() {
    const { user, userProfile, loading, signOut, hasRole } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#080808', color: '#fff' }}>
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    const isActive = (path) => location.pathname.includes(path);
    const title = getPageTitle(location.pathname);
    const initials = (userProfile?.name || 'A').charAt(0).toUpperCase();

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <img src="/assets/images/logo_v2.png" alt="FLOTENN" style={{ height: '45px', width: 'auto' }} />
                    </div>
                </div>

                <nav className="nav-links">
                    <Link to="/admin/dashboard" className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                        <i className="fas fa-home"></i> Dashboard
                    </Link>

                    <Link to="/admin/enquiries" className={`nav-item ${isActive('enquir') ? 'active' : ''}`}>
                        <i className="fas fa-envelope"></i> Enquiries
                    </Link>

                    {hasRole('super_admin', 'admin', 'editor') && (
                        <>
                            <Link to="/admin/pages" className={`nav-item ${isActive('/admin/pages') ? 'active' : ''}`}>
                                <i className="fas fa-file-alt"></i> Pages (Privacy/Terms)
                            </Link>
                            <Link to="/admin/services" className={`nav-item ${isActive('/admin/services') ? 'active' : ''}`}>
                                <i className="fas fa-tools"></i> Services
                            </Link>
                            <Link to="/admin/hero" className={`nav-item ${isActive('/admin/hero') ? 'active' : ''}`}>
                                <i className="fas fa-images"></i> Hero Slider
                            </Link>
                        </>
                    )}

                    <Link to="/admin/posts" className={`nav-item ${isActive('/admin/posts') ? 'active' : ''}`}>
                        <i className="fas fa-newspaper"></i> Blog Posts
                    </Link>

                    {hasRole('super_admin', 'admin') && (
                        <>
                            <Link to="/admin/users" className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}>
                                <i className="fas fa-users"></i> Users
                            </Link>
                            <Link to="/admin/logs" className={`nav-item ${isActive('/admin/logs') ? 'active' : ''}`}>
                                <i className="fas fa-history"></i> Activity Logs
                            </Link>
                        </>
                    )}

                    {hasRole('super_admin', 'admin', 'editor') && (
                        <>
                            <Link to="/admin/testimonials" className={`nav-item ${isActive('/admin/testimonials') ? 'active' : ''}`}>
                                <i className="fas fa-quote-left"></i> Testimonials
                            </Link>
                            <Link to="/admin/gallery" className={`nav-item ${isActive('/admin/gallery') ? 'active' : ''}`}>
                                <i className="fas fa-images"></i> Gallery
                            </Link>
                        </>
                    )}

                    <Link to="/admin/faqs" className={`nav-item ${isActive('/admin/faqs') ? 'active' : ''}`}>
                        <i className="fas fa-question-circle"></i> FAQs
                    </Link>

                    {hasRole('super_admin', 'admin', 'editor') && (
                        <Link to="/admin/seo" className={`nav-item ${isActive('/admin/seo') ? 'active' : ''}`}>
                            <i className="fas fa-search-location"></i> SEO Settings
                        </Link>
                    )}

                    {hasRole('super_admin', 'admin') && (
                        <>
                            <Link to="/admin/bookings" className={`nav-item ${isActive('/admin/bookings') ? 'active' : ''}`}>
                                <i className="fas fa-calendar-check"></i> Bookings
                            </Link>
                            <Link to="/admin/stores" className={`nav-item ${isActive('/admin/stores') ? 'active' : ''}`}>
                                <i className="fas fa-store"></i> Stores
                            </Link>
                        </>
                    )}

                    <a href="/" target="_blank" rel="noreferrer" className="nav-item" style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <i className="fas fa-external-link-alt"></i> View Website
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">{initials}</div>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{userProfile?.name || 'Admin User'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-grey)' }}>{userProfile?.email || 'admin@flotenn.in'}</div>
                        </div>
                    </div>
                    <button
                        onClick={signOut}
                        className="btn-danger"
                        style={{ display: 'block', width: '100%', textAlign: 'center', padding: '8px', borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer', border: 'none' }}
                    >
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-bar">
                    <div className="page-title">{title}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--admin-text-grey)' }}>
                        Today: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                </header>
                <div className="content-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

function getPageTitle(pathname) {
    const map = {
        '/admin/dashboard': 'Admin Dashboard',
        '/admin/enquiries': 'Enquiries',
        '/admin/services': 'Services',
        '/admin/posts': 'Blog Posts',
        '/admin/pages': 'Pages',
        '/admin/users': 'Users',
        '/admin/logs': 'Activity Logs',
        '/admin/testimonials': 'Testimonials',
        '/admin/gallery': 'Gallery',
        '/admin/faqs': 'FAQs',
        '/admin/seo': 'SEO Settings',
        '/admin/hero': 'Hero Slider',
        '/admin/stores': 'Stores',
        '/admin/bookings': 'Bookings',
        '/admin/media': 'Media',
    };
    for (const [path, title] of Object.entries(map)) {
        if (pathname.startsWith(path)) return title;
    }
    return 'Dashboard';
}
