import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getServices } from '../services/api';
import '../styles/pages.css';

export default function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getServices();
                setServices(data || []);
            } catch (err) {
                console.error('Error loading services:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <>
            <Helmet>
                <title>Our Services | Flotenn</title>
                <meta name="description" content="Explore our premium automotive services — PPF, ceramic coating, detailing, restoration and more." />
            </Helmet>

            {/* Hero */}
            <section className="page-hero tall" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1600&q=80')" }}>
                <div className="page-hero-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.95) 100%)' }}></div>
                <div className="page-hero-content">
                    <h1>WHAT WE <span>DO</span></h1>
                    <p style={{ color: '#aaa', letterSpacing: '0.2em', fontWeight: 500 }}>PAINT PROTECTION • DETAILING • RESTORATION</p>
                </div>
            </section>

            {/* Services Grid */}
            <section id="premium-services-grid" className="services-page" style={{ padding: '80px 0', background: '#050505' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 className="section-title" style={{ marginBottom: '10px' }}>CHOOSE FROM A RANGE OF <span className="text-primary">PREMIUM SERVICES</span></h2>
                        <div style={{ width: '60px', height: '3px', background: 'var(--primary)', margin: '0 auto', borderRadius: '2px' }}></div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#777' }}>Loading services...</div>
                    ) : services.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#777' }}>
                            <h3>No services available at the moment.</h3>
                        </div>
                    ) : (
                        <div className="service-grid-premium">
                            {services.map(svc => (
                                <Link to={`/service/${svc.slug}`} className="service-card-premium" key={svc.id} style={{ position: 'relative', display: 'block', height: '420px', borderRadius: '16px', overflow: 'hidden', textDecoration: 'none' }}>
                                    <div className="card-img-wrapper">
                                        <img src={svc.image_url || 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500&q=80'} alt={svc.name} loading="lazy" />
                                        <div className="card-overlay"></div>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="card-title">{svc.name}</h3>
                                        <p className="card-tagline">{svc.short_description || 'Premium Care'}</p>
                                        <div className="card-action">
                                            <span className="action-text">Explore</span>
                                            <span className="action-icon">→</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
