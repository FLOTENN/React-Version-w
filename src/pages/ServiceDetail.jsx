import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getServiceBySlug } from '../services/api';
import '../styles/pages.css';

export default function ServiceDetail() {
    const { slug } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getServiceBySlug(slug);
                setService(data);
            } catch (err) {
                console.error('Error loading service:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [slug]);

    if (loading) {
        return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#777' }}>Loading...</div>;
    }

    if (!service) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#777', gap: '20px' }}>
                <h2>Service Not Found</h2>
                <Link to="/services" className="btn-glow">Back to Services</Link>
            </div>
        );
    }

    const heroImg = service.image_url || 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1600&q=80';

    return (
        <>
            <Helmet>
                <title>{service.name} | Flotenn</title>
                <meta name="description" content={service.short_description || `Learn more about ${service.name} at Flotenn.`} />
            </Helmet>

            {/* Hero */}
            <section className="service-detail-hero" style={{ backgroundImage: `url('${heroImg}')` }}>
                <div className="page-hero-overlay"></div>
                <div className="page-hero-content">
                    <h1>{service.name}</h1>
                    {service.short_description && <p>{service.short_description}</p>}
                </div>
            </section>

            {/* Content */}
            <section className="service-detail-content">
                <div className="container">
                    {service.description ? (
                        <div className="content-body" dangerouslySetInnerHTML={{ __html: service.description }}></div>
                    ) : (
                        <p>Detailed information coming soon.</p>
                    )}

                    {/* CTA */}
                    <div style={{ textAlign: 'center', marginTop: '60px', padding: '50px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '15px', color: 'white' }}>
                            Interested in {service.name}?
                        </h3>
                        <p style={{ color: '#888', marginBottom: '30px' }}>Get a free consultation and quote from our specialists.</p>
                        <Link to="/contact" className="btn-glow">Enquire Now</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
