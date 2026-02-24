import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const yearRef = useRef(null);

    useEffect(() => {
        if (yearRef.current) {
            yearRef.current.textContent = new Date().getFullYear();
        }

        // Initialize Lenis smooth scroll + GSAP ticker (matching PHP footer.php)
        const lenis = new Lenis();

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);
        };
    }, []);

    return (
        <>
            <footer className="footer-premium">
                {/* Decorative Top Border */}
                <div className="footer-border"></div>

                <div className="container">
                    <div className="footer-grid-premium">
                        {/* Brand Column */}
                        <div className="footer-col-brand">
                            <div className="logo">
                                <img
                                    src="/assets/images/logo_v2.png"
                                    alt="FLOTENN"
                                    style={{ height: '50px', width: 'auto' }}
                                    loading="lazy"
                                    width="135"
                                    height="50"
                                />
                            </div>
                            <p className="brand-desc">
                                India's leading detailing studio. We provide top-notch Paint Protection Film (PPF),
                                Ceramic Coating, and Wrapping services to keep your vehicle looking brand new.
                            </p>
                            <div className="footer-socials">
                                <a href="https://www.facebook.com/brotomotiv/" target="_blank" rel="noreferrer" aria-label="Facebook">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="https://www.instagram.com/brotomotiv/" target="_blank" rel="noreferrer" aria-label="Instagram">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="https://www.youtube.com/@brotomotiv" target="_blank" rel="noreferrer" aria-label="YouTube">
                                    <i className="fab fa-youtube"></i>
                                </a>
                                <a href="https://www.linkedin.com/company/brotomotiv/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-col-links">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/blog">Blogs</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                                <li><Link to="/faq">FAQs</Link></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div className="footer-col-links">
                            <h4>Services</h4>
                            <ul>
                                <li><Link to="/services">All Services</Link></li>
                                <li><Link to="/service/ppf">Paint Protection Film</Link></li>
                                <li><Link to="/service/ceramic-coating">Ceramic Coating</Link></li>
                                <li><Link to="/service/wrapping">Vinyl Wrap</Link></li>
                                <li><Link to="/service/detailing">Car Detailing</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="footer-col-contact">
                            <h4>Get In Touch</h4>
                            <div className="contact-item">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>Gat No. 279, Manjari Road, Avhalwadi, Pune, Maharashtra 412207, India</span>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-envelope"></i>
                                <a href="mailto:contact@flotenn.in">contact@flotenn.in</a>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-phone-alt"></i>
                                <a href="tel:08600004513">08600004513</a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>
                            Copyright &copy; <span ref={yearRef}>{new Date().getFullYear()}</span>{' '}
                            <span style={{ color: 'var(--primary)' }}>Flotenn</span>. All rights reserved.
                        </p>
                        <div className="footer-bottom-links">
                            <Link to="/privacy-policy">Privacy Policy</Link>
                            <Link to="/terms">Terms &amp; Conditions</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
