import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        document.body.style.overflow = '';
    }, [location]);

    const toggleMobile = () => {
        setMobileOpen(!mobileOpen);
        document.body.style.overflow = !mobileOpen ? 'hidden' : '';
    };

    const closeMobile = () => {
        setMobileOpen(false);
        document.body.style.overflow = '';
    };

    return (
        <>
            <header className={scrolled ? 'scrolled' : ''}>
                <div className="container">
                    {/* Top Bar */}
                    <div className="top-bar">
                        <div style={{ fontSize: '0.7rem' }}>
                            &#9993; contact@flotenn.in &nbsp;|&nbsp; &#9742; 08600004513
                        </div>
                        <div className="header-actions"></div>
                    </div>

                    {/* Main Nav */}
                    <div className="nav-container">
                        <Link to="/" className="logo">
                            <img
                                src="/assets/images/logo_v2.png"
                                alt="FLOTENN"
                                style={{ height: '50px', width: 'auto' }}
                                width="135"
                                height="50"
                            />
                        </Link>
                        <nav>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/services">Services</Link></li>
                                <li><Link to="/gallery">Gallery</Link></li>
                                <li><Link to="/faq">FAQ</Link></li>
                                <li><Link to="/blog">Blogs</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                            </ul>
                        </nav>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div className="mobile-menu-toggle" onClick={toggleMobile}>
                                <i className="fas fa-bars"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={`mobile-nav ${mobileOpen ? 'active' : ''}`}>
                <div className="mobile-nav-close" style={{ fontSize: '2.5rem', padding: '10px' }} onClick={closeMobile}>
                    &times;
                </div>
                <ul style={{ width: '100%' }}>
                    <li><Link to="/" onClick={closeMobile}>Home</Link></li>
                    <li><Link to="/about" onClick={closeMobile}>About Us</Link></li>
                    <li><Link to="/services" onClick={closeMobile}>Services</Link></li>
                    <li><Link to="/gallery" onClick={closeMobile}>Gallery</Link></li>
                    <li><Link to="/faq" onClick={closeMobile}>FAQ</Link></li>
                    <li><Link to="/blog" onClick={closeMobile}>Blogs</Link></li>
                    <li><Link to="/contact" onClick={closeMobile}>Contact</Link></li>
                    <li><Link to="/contact" className="btn" onClick={closeMobile}>Enquire Now</Link></li>
                </ul>
            </div>
        </>
    );
}
