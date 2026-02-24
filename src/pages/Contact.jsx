import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { createEnquiry } from '../services/api';
import '../styles/pages.css';
import AnimatedButton from '../components/AnimatedButton';

const serviceOptions = [
    { value: 'PPF', label: 'Paint Protection Film (PPF)' },
    { value: 'Ceramic Coating', label: 'Ceramic Coating' },
    { value: 'Detailing', label: 'Car Detailing' },
    { value: 'Wraps', label: 'Vinyl Wraps' },
    { value: 'Restoration', label: 'Restoration' },
    { value: 'Other', label: 'Other Query' }
];

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: '', subject: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectOption = (value, label) => {
        setFormData(prev => ({ ...prev, subject: value }));
        setDropdownOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createEnquiry(formData);
            setSubmitted(true);
            setFormData({ name: '', phone: '', email: '', city: '', subject: '', message: '' });
        } catch (err) {
            console.error('Error submitting enquiry:', err);
            alert('There was an error submitting your enquiry. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const selectedLabel = serviceOptions.find(o => o.value === formData.subject)?.label;

    return (
        <>
            <Helmet>
                <title>Contact Us | Flotenn</title>
                <meta name="description" content="Get in touch with Flotenn for premium car care services. Visit our studio or send us a message." />
            </Helmet>

            {/* Hero */}
            <section className="page-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600&q=80')" }}>
                <div className="page-hero-overlay"></div>
                <div className="page-hero-content">
                    <h1>CONTACT <span>US</span></h1>
                    <p>Expert car care is just a message away. Visit our studio or get in touch for a consultation.</p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="contact-section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Left: Info Cards */}
                        <div className="contact-info-stack">
                            <div className="contact-card">
                                <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
                                <div className="contact-details">
                                    <h3>Visit Our Studio</h3>
                                    <p>
                                        Flotenn Autoz Pvt Ltd<br />
                                        Gat No. 279, Manjari Road, Avhalwadi,<br />
                                        Pune, Maharashtra 412207
                                    </p>
                                    <a href="https://maps.app.goo.gl/HbCjs17W6CmSo4ZS6" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '8px', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase' }}>Get Directions →</a>
                                </div>
                            </div>

                            <div className="contact-card">
                                <div className="contact-icon"><i className="fas fa-phone-alt"></i></div>
                                <div className="contact-details">
                                    <h3>Call Us</h3>
                                    <p>Mon - Sun: 10:00 AM - 8:00 PM</p>
                                    <a href="tel:08600004513" style={{ fontSize: '1.1rem', color: 'var(--white)', fontWeight: 700, marginTop: '5px', display: 'block' }}>08600004513</a>
                                </div>
                            </div>

                            <div className="contact-card">
                                <div className="contact-icon"><i className="fas fa-envelope"></i></div>
                                <div className="contact-details">
                                    <h3>Email Us</h3>
                                    <p>For general enquiries & support</p>
                                    <a href="mailto:contact@flotenn.in" style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: 600 }}>contact@flotenn.in</a>
                                </div>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="form-wrapper">
                            <h3 className="form-title">Send a <span>Message</span></h3>

                            {submitted ? (
                                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '20px', display: 'block' }}></i>
                                    <h3 style={{ color: 'white', marginBottom: '10px' }}>Thank You!</h3>
                                    <p style={{ color: '#888' }}>Your message has been sent successfully. We'll get back to you soon.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div className="form-group">
                                            <input type="text" name="name" className="form-control-premium" placeholder="Your Name *" required value={formData.name} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <input type="tel" name="phone" className="form-control-premium" placeholder="Phone Number *" required value={formData.phone} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div className="form-group">
                                            <input type="email" name="email" className="form-control-premium" placeholder="Email Address *" required value={formData.email} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <input type="text" name="city" className="form-control-premium" placeholder="City *" required value={formData.city} onChange={handleChange} />
                                        </div>
                                    </div>

                                    {/* Custom Dropdown */}
                                    <div className={`form-group custom-select-wrapper${dropdownOpen ? ' active' : ''}`} ref={dropdownRef}>
                                        <div className="custom-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                            <span className={`custom-dropdown-selected${formData.subject ? ' has-value' : ''}`}>
                                                {selectedLabel || 'Service Interested In *'}
                                            </span>
                                            <div className="custom-dropdown-arrow">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                            </div>
                                        </div>
                                        <div className="custom-dropdown-options" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderTop: 'none', borderRadius: '0 0 12px 12px', zIndex: 100, opacity: dropdownOpen ? 1 : 0, visibility: dropdownOpen ? 'visible' : 'hidden', transform: dropdownOpen ? 'translateY(0)' : 'translateY(-10px)', transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
                                            {serviceOptions.map(opt => (
                                                <div className="custom-option" key={opt.value} onClick={() => handleSelectOption(opt.value, opt.label)} style={{ padding: '16px 24px', color: '#ccc', cursor: 'pointer', transition: 'all 0.2s ease', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.95rem' }}>
                                                    {opt.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <textarea name="message" rows="4" className="form-control-premium" placeholder="Tell us about your requirements..." required value={formData.message} onChange={handleChange} style={{ resize: 'vertical' }}></textarea>
                                    </div>

                                    <AnimatedButton type="submit" disabled={submitting} iconClass="fa-solid fa-paper-plane">
                                        {submitting ? 'Sending...' : 'Send Message'}
                                    </AnimatedButton>
                                    <p style={{ fontSize: '0.8rem', color: '#555', marginTop: '25px', textAlign: 'center' }}>
                                        <i>We usually respond within 24 hours.</i>
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Map */}
            <section style={{ position: 'relative' }}>
                <div className="map-container">
                    <div className="map-border-top"></div>
                    <a href="https://maps.app.goo.gl/HbCjs17W6CmSo4ZS6" target="_blank" rel="noopener noreferrer" className="map-interaction-hint">
                        <i className="fas fa-directions"></i> Get Directions
                    </a>
                    <div className="map-overlay-gradient"></div>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d35962.24316467987!2d73.95460409954273!3d18.567169111691527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c3eb696a0f91%3A0xfcf40cf5d5a8c136!2sGayatri%20Packaging!5e1!3m2!1sen!2sin!4v1771073855270!5m2!1sen!2sin"
                        className="map-section"
                        allowFullScreen=""
                        loading="lazy"
                        style={{ border: 0 }}
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Flotenn Location"
                    ></iframe>
                    <div className="map-border-bottom"></div>
                </div>
            </section>
        </>
    );
}
